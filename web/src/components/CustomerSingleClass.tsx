import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, CheckCircle, MessageCircle, ArrowLeft, Star, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerSingleClass = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'config' | 'searching' | 'matched' | 'chat'>('config');
  const [radius, setRadius] = useState<number>(10);
  const [objective, setObjective] = useState('');
  const [chatMessages, setChatMessages] = useState<{sender: 'me' | 'prof', text: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  // Professor mockado que aceitou corrida
  const matchedProfessor = {
    name: 'Carlos Oliveira',
    age: 34,
    experienceYears: 12,
    rating: 4.9,
    price: 180,
    distance: 4.2
  };

  useEffect(() => {
    if (phase === 'searching') {
      const timer = setTimeout(() => {
        setPhase('matched');
      }, 4000); // 4 seconds of searching drama
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleSendMessage = () => {
    if(!currentMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: 'me', text: currentMessage }]);
    setCurrentMessage('');
    setTimeout(() => {
       setChatMessages(prev => [...prev, { sender: 'prof', text: 'Perfeito! Qual horário funciona melhor para você?' }]);
    }, 1500);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div style={{ width: '100%', maxWidth: '600px', padding: '24px', position: 'relative' }}>
        
        {/* Back Button */}
        {phase !== 'searching' && (
          <button onClick={() => {
            if(phase === 'chat') setPhase('matched');
            else if(phase === 'matched') setPhase('config');
            else navigate('/');
          }} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px', fontWeight: 600 }}>
            <ArrowLeft size={20} /> Voltar
          </button>
        )}

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
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Encontrar Aulas Avulsas</h1>
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

              <button onClick={() => setPhase('searching')} className="button-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', fontSize: '18px' }}>
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

              <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#eee', margin: '0 auto 24px', backgroundImage: 'url(https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop)', backgroundSize: 'cover' }}></div>
                
                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0' }}>{matchedProfessor.name}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={16} color="#F59E0B" fill="#F59E0B" /> {matchedProfessor.rating}</span>
                   <span>{matchedProfessor.age} anos</span>
                   <span>{matchedProfessor.experienceYears} anos de exp.</span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-around', marginBottom: '32px' }}>
                   <div>
                     <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Distância</div>
                     <div style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>{matchedProfessor.distance} km</div>
                   </div>
                   <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                   <div>
                     <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Valor p/ Hr</div>
                     <div style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '18px' }}>R$ {matchedProfessor.price}</div>
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
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundImage: 'url(https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop)', backgroundSize: 'cover' }}></div>
                <div>
                  <h3 style={{ color: 'white', margin: '0 0 4px 0' }}>{matchedProfessor.name}</h3>
                  <div style={{ color: '#10B981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%'}}></div> Online</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                   Feche o local, data e hora com o professor pelo chat.
                 </div>
                 
                 <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '80%' }}>
                   Olá! Vi que você quer uma aula avulsa num raio de {radius}km. Onde prefere jogar?
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
    </div>
  );
};
