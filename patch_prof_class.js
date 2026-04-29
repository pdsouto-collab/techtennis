const fs = require('fs');
const path = './web/src/components/ProfessorSingleClass.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add useEffect and API dependencies
const imports = `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Info, CheckCircle, Send, ArrowLeft, DollarSign, Award, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';`;

content = content.replace(/^import.*react-router-dom';/ms, imports);

// 2. Add API_URL and getAuthHeader inside component
const apiConfig = `
  const API_URL = import.meta.env.VITE_API_URL || 'https://techtennis-api.vercel.app';
  const getAuthHeader = () => {
    const t = localStorage.getItem('tt_auth_token');
    return t ? { 'Authorization': \`Bearer \${t}\` } : {} as HeadersInit;
  };
`;
content = content.replace(/const navigate = useNavigate\(\);/, 'const navigate = useNavigate();\n' + apiConfig);

// 3. Replace mock requests with state
content = content.replace(/const requests = \[.*?\];/ms, `
  const [requests, setRequests] = useState<any[]>([]);
  const [activeMatch, setActiveMatch] = useState<any>(null);

  // Poll requests when online
  useEffect(() => {
    let interval: any;
    if (phase === 'requests') {
      const fetchReqs = async () => {
        try {
          const res = await fetch(\`\${API_URL}/api/single-class/requests\`, { headers: getAuthHeader() });
          if(res.ok) setRequests(await res.json());
        } catch(e) {}
      };
      fetchReqs();
      interval = setInterval(fetchReqs, 3000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  // Fetch initial profile
  useEffect(() => {
    const fetchProf = async () => {
      try {
        const res = await fetch(\`\${API_URL}/api/single-class/profile\`, { headers: getAuthHeader() });
        if(res.ok) {
          const data = await res.json();
          if(data) {
            setPrice(data.price || '180');
            setExperience(data.experience || '12');
            setMaxDistance(data.maxDistance || 15);
            setSpecialty(data.specialty || '');
            if(data.isOnline) setPhase('requests');
          }
        }
      } catch(e) {}
    };
    fetchProf();
  }, []);
`);

// 4. Update phase changing to save profile
content = content.replace(
  /onClick=\{\(\) => setPhase\('requests'\)\}/,
  `onClick={async () => {
    await fetch(\`\${API_URL}/api/single-class/profile\`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, experience, maxDistance, specialty, isOnline: true })
    });
    setPhase('requests');
  }}`
);

// 5. Update accept match
content = content.replace(
  /onClick=\{\(\) => setPhase\('chat'\)\}/,
  `onClick={async () => {
    const res = await fetch(\`\${API_URL}/api/single-class/match/\${req.id}/accept\`, {
      method: 'PUT', headers: getAuthHeader()
    });
    if(res.ok) {
      setActiveMatch(req);
      setPhase('chat');
    }
  }}`
);

// 6. Handle back to offline
content = content.replace(
  /const handleBack = \(\) => \{[\s\S]*?\};/,
  `const handleBack = async () => {
    if(phase === 'chat') {
      setPhase('requests');
      setActiveMatch(null);
    } else if(phase === 'requests') {
      await fetch(\`\${API_URL}/api/single-class/profile\`, {
        method: 'POST',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, experience, maxDistance, specialty, isOnline: false })
      });
      setPhase('config');
    } else {
      navigate('/');
    }
  };`
);

// 7. Chat polling
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
      body: JSON.stringify({ text: msg, sender: 'professor' })
    });
    setChatMessages(prev => [...prev, { sender: 'professor', text: msg }]);
  };`
);

// 8. Fix radar list mapping
content = content.replace(
  /req\.studentName/g,
  `req.studentName`
);
content = content.replace(
  /req\.timeAgo/g,
  `new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})`
);
content = content.replace(
  /\{req\.distance\} km/g,
  `Aprox. 4.2 km`
);

// 9. Fix chat header
content = content.replace(
  /Roberto Almeida/g,
  `{activeMatch?.studentName || 'Aluno'}`
);
content = content.replace(
  /RA/,
  `{activeMatch?.studentName?.substring(0,2).toUpperCase() || 'AL'}`
);

// 10. Fix chat messages mapping
content = content.replace(
  /msg\.sender === 'me'/g,
  `msg.sender === 'professor'`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed ProfessorSingleClass');
