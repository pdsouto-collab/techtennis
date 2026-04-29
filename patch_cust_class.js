const fs = require('fs');
const path = './web/src/components/CustomerSingleClass.tsx';
let content = fs.readFileSync(path, 'utf8');

const imports = `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, CheckCircle, MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';`;

content = content.replace(/^import.*react-router-dom';/ms, imports);

const apiConfig = `
  const API_URL = import.meta.env.VITE_API_URL || 'https://techtennis-api.vercel.app';
  const getAuthHeader = () => {
    const t = localStorage.getItem('tt_auth_token');
    return t ? { 'Authorization': \`Bearer \${t}\` } : {} as HeadersInit;
  };
`;
content = content.replace(/const navigate = useNavigate\(\);/, 'const navigate = useNavigate();\n' + apiConfig);

// Fix matchedProfessor to use activeMatch and fetched state
content = content.replace(/const matchedProfessor = \{[\s\S]*?\};/, `
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [professorDetails, setProfessorDetails] = useState<any>(null);

  // Poll for match status when searching
  useEffect(() => {
    let interval: any;
    if (phase === 'searching' && activeMatch) {
      const checkStatus = async () => {
        try {
          const res = await fetch(\`\${API_URL}/api/single-class/match/\${activeMatch.id}/status\`, { headers: getAuthHeader() });
          if(res.ok) {
            const data = await res.json();
            if(data && data.status === 'accepted') {
              setPhase('matched');
            }
          }
        } catch(e) {}
      };
      interval = setInterval(checkStatus, 2000);
    }
    return () => clearInterval(interval);
  }, [phase, activeMatch]);

  // Remove fake timer
  useEffect(() => {
    // Phase search logic handles via DB polling now
  }, [phase]);
`);

// Searching logic (post to /api/single-class/match)
content = content.replace(
  /onClick=\{\(\) => setPhase\('searching'\)\}/,
  `onClick={async () => {
    setPhase('searching');
    try {
      // Find a professor
      const profRes = await fetch(\`\${API_URL}/api/single-class/search\`, { headers: getAuthHeader() });
      if (profRes.ok) {
        const prof = await profRes.json();
        if (prof) {
          setProfessorDetails(prof);
          // Create match
          const matchRes = await fetch(\`\${API_URL}/api/single-class/match\`, {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ professorId: prof.professorId, objective })
          });
          if (matchRes.ok) {
            setActiveMatch(await matchRes.json());
            return;
          }
        }
      }
      alert('Nenhum professor encontrado na sua região no momento.');
      setPhase('config');
    } catch(e) {
      setPhase('config');
    }
  }}`
);

// Chat polling
content = content.replace(
  /const handleSendMessage = \(\) => \{[\s\S]*?\};/,
  `
  useEffect(() => {
    let interval: any;
    if (phase === 'chat' && activeMatch) {
      const fetchChat = async () => {
        try {
          const res = await fetch(\`\${API_URL}/api/single-class/chat/\${activeMatch.id}\`, { headers: getAuthHeader() });
          if(res.ok) setChatMessages(await res.json());
        } catch(e) {}
      };
      fetchChat();
      interval = setInterval(fetchChat, 2000);
    }
    return () => clearInterval(interval);
  }, [phase, activeMatch]);

  const handleSendMessage = async () => {
    if(!currentMessage.trim() || !activeMatch) return;
    const msg = currentMessage;
    setCurrentMessage('');
    await fetch(\`\${API_URL}/api/single-class/chat/\${activeMatch.id}\`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: msg, sender: 'student' })
    });
    setChatMessages(prev => [...prev, { sender: 'student', text: msg }]);
  };`
);

// Fix UI mappings
content = content.replace(/matchedProfessor\.name/g, `(professorDetails?.name || 'Professor')`);
content = content.replace(/matchedProfessor\.age/g, `34`);
content = content.replace(/matchedProfessor\.experienceYears/g, `(professorDetails?.experience || 12)`);
content = content.replace(/matchedProfessor\.distance/g, `(professorDetails?.maxDistance || 5)`);
content = content.replace(/matchedProfessor\.price/g, `(professorDetails?.price || 180)`);

// Fix chat messages sender condition
content = content.replace(/msg\.sender === 'me'/g, `msg.sender === 'student'`);

// Remove fake message insertion
content = content.replace(/<div style=\{\{ alignSelf: 'flex-start', background: 'rgba\(255,255,255,0.1\)', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '80%' \}\}>[\s\S]*?<\/div>/, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed CustomerSingleClass');
