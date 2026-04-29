import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Info, CheckCircle, Send, ArrowLeft, DollarSign, Award, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfessorSingleClass = () => {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://techtennis-api.vercel.app';
  const getAuthHeader = () => {
    const t = localStorage.getItem('tt_auth_token');
    return t ? { 'Authorization': `Bearer ${t}` } : {} as HeadersInit;
  };

  const [phase, setPhase] = useState<'config' | 'requests' | 'chat'>('config');
  const [chatMessages, setChatMessages] = useState<{sender: 'professor' | 'student', text: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // States para a configuração do Perfil do Professor
  const [price, setPrice] = useState<string>('180');
  const [experience, setExperience] = useState<string>('12');
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [specialty, setSpecialty] = useState('');

  // Simulating requests pinging in
  
  const [requests, setRequests] = useState<any[]>([]);
  const [activeMatch, setActiveMatch] = useState<any>(null);

  // Poll requests when online
  useEffect(() => {
    let interval: any;
    if (phase === 'requests') {
      const fetchReqs = async () => {
        try {
          const res = await fetch(`${API_URL}/api/single-class/requests`, { headers: getAuthHeader() });
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
        const res = await fetch(`${API_URL}/api/single-class/profile`, { headers: getAuthHeader() });
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


  
  useEffect(() => {
    let interval: any;
    if (phase === 'chat' && activeMatch) {
      const fetchChat = async () => {
        try {
          const res = await fetch(`${API_URL}/api/single-class/chat/${activeMatch.id}`, { headers: getAuthHeader() });
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
    await fetch(`${API_URL}/api/single-class/chat/${activeMatch.id}`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: msg, sender: 'professor' })
    });
    setChatMessages(prev => [...prev, { sender: 'professor', text: msg }]);
  };

  const handleBack = async () => {
    if(phase === 'chat') {
      setPhase('requests');
      setActiveMatch(null);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div style={{ width: '100%', maxWidth: '600px', padding: '24px', position: 'relative' }}>
        

        <AnimatePresence mode="wait">
          
          {/* FASE 1: CONFIGURAÇÃO DO PERFIL */}
          {(phase === 'config' || phase === 'requests') && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel"
              style={{ padding: '32px', borderRadius: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <button onClick={handleBack} style={{ background: 'var(--bg-panel)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <ArrowLeft size={24} />
                </button>
                <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 800, margin: 0 }}>Seu Perfil de Aulas</h1>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Configure como os alunos verão você no radar de aulas avulsas.</p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                  <DollarSign size={18} color="var(--primary-color)" /> Valor por Hora (R$)
                </label>
                <input 
                  type="number" 
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="Ex: 150"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', outline: 'none', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                  <Award size={18} color="var(--primary-color)" /> Anos de Experiência
                </label>
                <input 
                  type="number" 
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="Ex: 5"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', outline: 'none', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                   <MapPin size={18} color="var(--primary-color)" /> Raio Máximo de Atendimento ({maxDistance} km)
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="5" 
                  value={maxDistance} 
                  onChange={e => setMaxDistance(Number(e.target.value))} 
                  style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '13px', marginTop: '8px' }}>
                  <span>5km</span>
                  <span>25km</span>
                  <span>50km</span>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '12px', fontWeight: 600 }}>Especialidade / Foco (Opcional)</label>
                <textarea 
                  placeholder="Ex: Foco em performance, correção biomecânica, treinos táticos..."
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', outline: 'none', resize: 'vertical', minHeight: '100px' }}
                />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '18px' }}>Status no Radar</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>Fique online para receber alunos próximos.</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input 
                    type="checkbox" 
                    checked={phase === 'requests'}
                    onChange={async (e) => {
                      const isNowOnline = e.target.checked;
                      await fetch(`${API_URL}/api/single-class/profile`, {
                        method: 'POST',
                        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({ price, experience, maxDistance, specialty, isOnline: isNowOnline })
                      });
                      setPhase(isNowOnline ? 'requests' : 'config');
                    }}
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: phase === 'requests' ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)',
                    transition: '.4s', borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '26px', width: '26px', left: '4px', bottom: '4px',
                      backgroundColor: phase === 'requests' ? 'var(--text-dark)' : 'white',
                      transition: '.4s', borderRadius: '50%',
                      transform: phase === 'requests' ? 'translateX(26px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {/* FASE 2: LISTA DE SOLICITAÇÕES (RADAR) */}
          {phase === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, margin: 0 }}>Radar Ativo</h2>
                 </div>
                 <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} className="pulse-dot"></div>
                    Online ({maxDistance}km)
                 </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {requests.map((req, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    key={req.id} 
                    className="glass-panel" 
                    style={{ padding: '24px', borderRadius: '20px', borderLeft: '4px solid var(--primary-color)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                       <h3 style={{ color: 'white', margin: 0, fontSize: '20px' }}>{req.studentName}</h3>
                       <span style={{ color: 'var(--primary-color)', fontSize: '13px', fontWeight: 600 }}>{new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <Navigation size={16} /> Aprox. 4.2 km de você
                       </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                       <Info size={18} color="var(--primary-color)" />
                       "{req.objective}"
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                       <button onClick={async () => {
    const res = await fetch(`${API_URL}/api/single-class/match/${req.id}/accept`, {
      method: 'PUT', headers: getAuthHeader()
    });
    if(res.ok) {
      setActiveMatch(req);
      setPhase('chat');
    }
  }} className="button-primary" style={{ flex: 1, padding: '12px', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                         <CheckCircle size={18} /> Aceitar Aluno
                       </button>
                    </div>
                  </motion.div>
                ))}

                {requests.length === 0 && (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Buscando alunos na sua região...
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* FASE 3: CHAT */}
          {phase === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel"
              style={{ borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '70vh' }}
            >
              {/* Chat Header */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={handleBack} style={{ background: 'var(--bg-panel)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexShrink: 0 }}>
                  <ArrowLeft size={20} />
                </button>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-color)', color: 'var(--text-dark)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '20px' }}>
                  RA
                </div>
                <div>
                  <h3 style={{ color: 'white', margin: '0 0 4px 0' }}>{activeMatch?.studentName || 'Aluno'}</h3>
                  <div style={{ color: '#10B981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%'}}></div> Online</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                   Você aceitou o match! Combinem agora o horário e local.
                 </div>
                 
                 {chatMessages.map((msg, i) => (
                    <div key={i} style={{ 
                      alignSelf: msg.sender === 'professor' ? 'flex-end' : 'flex-start', 
                      background: msg.sender === 'professor' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', 
                      color: msg.sender === 'professor' ? 'var(--text-dark)' : 'white', 
                      padding: '12px 16px', 
                      borderRadius: msg.sender === 'professor' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
                      maxWidth: '80%' 
                    }}>
                      {msg.text}
                    </div>
                 ))}
              </div>

              {/* Chat Input */}
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px' }}>
                 <input 
                   type="text" 
                   value={currentMessage}
                   onChange={e => setCurrentMessage(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Digite uma mensagem..."
                   style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '100px', padding: '0 20px', color: 'white', outline: 'none' }}
                 />
                 <button onClick={handleSendMessage} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-color)', color: 'var(--text-dark)', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                   <Send size={20} />
                 </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
          .pulse-dot {
            animation: pulse 2s infinite;
          }
        `}
      </style>
    </div>
  );
};
