import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, MessageCircle, ArrowLeft, Star, Send, Navigation, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfessorSingleClass = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'requests' | 'chat'>('requests');
  const [chatMessages, setChatMessages] = useState<{sender: 'me' | 'client', text: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  // Simulating requests pinging in
  const requests = [
    {
      id: 1,
      studentName: 'Roberto Almeida',
      distance: 4.2,
      objective: 'Quero bater bola forte e focar no saque.',
      timeAgo: 'Agora mesmo'
    },
    {
      id: 2,
      studentName: 'Carla Dias',
      distance: 8.5,
      objective: 'Treino tático para torneio.',
      timeAgo: 'Há 2 min'
    }
  ];

  const handleSendMessage = () => {
    if(!currentMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: 'me', text: currentMessage }]);
    setCurrentMessage('');
    setTimeout(() => {
       setChatMessages(prev => [...prev, { sender: 'client', text: 'Excelente! Pode ser na quadra pública ou no meu condomínio?' }]);
    }, 1500);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div style={{ width: '100%', maxWidth: '600px', padding: '24px', position: 'relative' }}>
        
        {/* Back Button */}
        <button onClick={() => {
          if(phase === 'chat') setPhase('requests');
          else navigate('/');
        }} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px', fontWeight: 600 }}>
          <ArrowLeft size={20} /> Voltar
        </button>

        <AnimatePresence mode="wait">
          {/* FASE 1: LISTA DE SOLICITAÇÕES */}
          {phase === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 800, margin: 0 }}>Radar de Aulas</h1>
                 <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} className="pulse-dot"></div>
                    Buscando
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
                       <span style={{ color: 'var(--primary-color)', fontSize: '13px', fontWeight: 600 }}>{req.timeAgo}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <Navigation size={16} /> {req.distance} km de você
                       </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                       <Info size={18} color="var(--primary-color)" />
                       "{req.objective}"
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                       <button onClick={() => setPhase('chat')} className="button-primary" style={{ flex: 1, padding: '12px', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                         <CheckCircle size={18} /> Aceitar Aluno
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FASE 2: CHAT */}
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
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-color)', color: 'var(--text-dark)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '20px' }}>
                  RA
                </div>
                <div>
                  <h3 style={{ color: 'white', margin: '0 0 4px 0' }}>Roberto Almeida</h3>
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
                      alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', 
                      background: msg.sender === 'me' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', 
                      color: msg.sender === 'me' ? 'var(--text-dark)' : 'white', 
                      padding: '12px 16px', 
                      borderRadius: msg.sender === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
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
