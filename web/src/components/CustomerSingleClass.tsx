import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, CheckCircle, MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerSingleClass = () => {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://techtennis-api.vercel.app';
  const getAuthHeader = () => {
    const t = localStorage.getItem('tt_auth_token');
    return t ? { 'Authorization': `Bearer ${t}` } : {} as HeadersInit;
  };

  const [phase, setPhase] = useState<'config' | 'searching' | 'matched' | 'chat'>('config');
  const [radius, setRadius] = useState<number>(10);
  const [objective, setObjective] = useState('');
  const [chatMessages, setChatMessages] = useState<{sender: 'professor' | 'student', text: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  // Professor mockado que aceitou corrida
  
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [professorDetails, setProfessorDetails] = useState<any>(null);

  // Poll for match status when searching
  useEffect(() => {
    let interval: any;
    if (phase === 'searching' && activeMatch) {
      const checkStatus = async () => {
        try {
          const res = await fetch(`${API_URL}/api/single-class/match/${activeMatch.id}/status`, { headers: getAuthHeader() });
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


  useEffect(() => {
    if (phase === 'searching') {
      const timer = setTimeout(() => {
        setPhase('matched');
      }, 4000); // 4 seconds of searching drama
      return () => clearTimeout(timer);
    }
  }, [phase]);

  
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
      body: JSON.stringify({ text: msg, sender: 'student' })
    });
    setChatMessages(prev => [...prev, { sender: 'student', text: msg }]);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div style={{ width: '100%', maxWidth: '600px', padding: '24px', position: 'relative' }}>
        


        <AnimatePresence mode="wait">
          {/* FASE 1: CONFIGURAÇÃO */}
          {phase === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel"
              style={{ padding: '32px', borderRadius: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <button onClick={() => navigate('/')} style={{ background: 'var(--bg-panel)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <ArrowLeft size={24} />
                </button>
                <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 800, margin: 0 }}>Encontrar Aulas Avulsas</h1>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Ache os melhores professores disponíveis agora no seu perímetro.</p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '12px', fontWeight: 600 }}>Raio de Busca ({radius} km)</label>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="5" 
                  value={radius} 
                  onChange={e => setRadius(Number(e.target.value))} 
                  style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '13px', marginTop: '8px' }}>
                  <span>5km</span>
                  <span>25km</span>
                  <span>50km</span>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '12px', fontWeight: 600 }}>Objetivo do Treino (Opcional)</label>
                <textarea 
                  placeholder="Ex: Quero bater bola forte, corrigir meu saque, ou fazer um treino tático..."
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', outline: 'none', resize: 'vertical', minHeight: '100px' }}
                />
              </div>

              <button onClick={async () => {
    setPhase('searching');
    try {
      // Find a professor
      const profRes = await fetch(`${API_URL}/api/single-class/search`, { headers: getAuthHeader() });
      if (profRes.ok) {
        const prof = await profRes.json();
        if (prof) {
          setProfessorDetails(prof);
          // Create match
          const matchRes = await fetch(`${API_URL}/api/single-class/match`, {
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
  }} className="button-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', fontSize: '18px' }}>
                <Search size={22} /> Buscar Professor Agora
              </button>
            </motion.div>
          )}

          {/* FASE 2: BUSCANDO (RADAR) */}
          {phase === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}
            >
              <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 {/* Radar rings */}
                 <motion.div animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid var(--primary-color)', borderRadius: '50%' }} />
                 <motion.div animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 1 }} style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid var(--primary-color)', borderRadius: '50%' }} />
                 
                 <div style={{ background: 'var(--bg-panel)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                   <MapPin size={32} color="var(--primary-color)" />
                 </div>
              </div>
              <h2 style={{ color: 'white', marginTop: '32px', fontWeight: 700 }}>Notificando professores...</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Buscando num raio de {radius}km</p>
              
              <button 
                onClick={() => setPhase('config')}
                style={{ marginTop: '40px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '100px', color: 'white', cursor: 'pointer' }}
              >
                Cancelar busca
              </button>
            </motion.div>
          )}

          {/* FASE 3: MATCH ENCONTRADO */}
          {phase === 'matched' && (
            <motion.div
              key="matched"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '8px 16px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                   <CheckCircle size={18} /> Profissional Aceitou o Convite!
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', textAlign: 'center', position: 'relative' }}>
                <button onClick={() => setPhase('config')} style={{ position: 'absolute', top: '24px', left: '24px', background: 'var(--bg-panel)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <ArrowLeft size={20} />
                </button>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#eee', margin: '0 auto 24px', backgroundImage: 'url(https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop)', backgroundSize: 'cover' }}></div>
                
                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0' }}>{(professorDetails?.name || 'Professor')}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                   <span>{34} anos</span>
                   <span>{(professorDetails?.experience || 12)} anos de exp.</span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-around', marginBottom: '32px' }}>
                   <div>
                     <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Distância</div>
                     <div style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>{(professorDetails?.maxDistance || 5)} km</div>
                   </div>
                   <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                   <div>
                     <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Valor p/ Hr</div>
                     <div style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '18px' }}>R$ {(professorDetails?.price || 180)}</div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                   <button onClick={() => setPhase('config')} style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Recusar</button>
                   <button onClick={() => setPhase('chat')} className="button-primary" style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', fontSize: '16px' }}>
                     <MessageCircle size={20} /> Entrar no Chat
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FASE 4: CHAT */}
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
                <button onClick={() => setPhase('matched')} style={{ background: 'var(--bg-panel)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexShrink: 0 }}>
                  <ArrowLeft size={20} />
                </button>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundImage: 'url(https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop)', backgroundSize: 'cover' }}></div>
                <div>
                  <h3 style={{ color: 'white', margin: '0 0 4px 0' }}>{(professorDetails?.name || 'Professor')}</h3>
                  <div style={{ color: '#10B981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%'}}></div> Online</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                   Feche o local, data e hora com o professor pelo chat.
                 </div>
                 
                 

                 {chatMessages.map((msg, i) => (
                    <div key={i} style={{ 
                      alignSelf: msg.sender === 'student' ? 'flex-end' : 'flex-start', 
                      background: msg.sender === 'student' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', 
                      color: msg.sender === 'student' ? 'var(--text-dark)' : 'white', 
                      padding: '12px 16px', 
                      borderRadius: msg.sender === 'student' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
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
    </div>
  );
};
