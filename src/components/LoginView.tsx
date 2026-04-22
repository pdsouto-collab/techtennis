import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import brandLogo from '../assets/techtennis-logo.png';
import atpLogo from '../assets/atp-tour-logo.png';
import bgImage from '../assets/miami-open-ernesto.jpg';

export const LoginView = () => {
  const { login, registerClient, registerProfessor } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register_client' | 'register_prof'>('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regExp, setRegExp] = useState('');
  const [regTraining, setRegTraining] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = login(email, password);
    if (typeof res === 'string') {
      setLoginError(res);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSuccessMsg('');
    
    if (mode === 'register_client') {
      registerClient(regName, email, password, regPhone);
      setSuccessMsg('Cadastro realizado! Você já pode entrar.');
      setMode('login');
    } else {
      registerProfessor(regName, email, password, regPhone, regExp, regTraining);
      setSuccessMsg('Cadastro realizado com sucesso! Seu perfil de Professor será avaliado por um Administrador em até 48h. Você receberá um aviso assim que for liberado.');
      setMode('login');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      padding: '24px'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,12,60,0.9) 0%, rgba(0,12,60,0.4) 100%)' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '48px',
          width: '100%',
          maxWidth: '500px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={atpLogo} alt="ATP Tour Pro Stringer Store" style={{ height: '160px', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.form key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {successMsg && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10B981', color: '#34D399', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
                  {successMsg}
                </div>
              )}
              {loginError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', color: '#F87171', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>E-mail</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>Senha</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
              </div>
              <button type="submit" className="button-primary" style={{ padding: '16px', fontSize: '16px', fontWeight: 800, marginTop: '8px', color: '#139AD6' }}>
                Acessar Plataforma
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '8px' }}>
                <img src={brandLogo} alt="TechTennis" style={{ height: '90px', mixBlendMode: 'multiply', filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '16px' }}>Ainda não tem acesso?</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => { setMode('register_client'); setSuccessMsg(''); setLoginError(''); }} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                    Sou Cliente
                  </button>
                  <button type="button" onClick={() => { setMode('register_prof'); setSuccessMsg(''); setLoginError(''); }} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                    Sou Professor
                  </button>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.form key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ color: 'white', fontSize: '20px', textAlign: 'center', marginBottom: '16px' }}>
                Cadastro de {mode === 'register_client' ? 'Cliente' : 'Professor'}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>Nome Completo *</label>
                  <input required type="text" value={regName} onChange={e => setRegName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>E-mail *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>Telefone *</label>
                  <input required type="text" value={regPhone} onChange={e => setRegPhone(e.target.value)} style={inputStyle} />
                </div>
                
                {mode === 'register_prof' && (
                  <>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>Anos de Experiência</label>
                      <input type="number" value={regExp} onChange={e => setRegExp(e.target.value)} style={inputStyle} placeholder="Ex: 5" />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>Tipos de Treino</label>
                      <input type="text" value={regTraining} onChange={e => setRegTraining(e.target.value)} style={inputStyle} placeholder="Ex: Competitivo, Rebatedor" />
                    </div>
                  </>
                )}

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>Senha *</label>
                  <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setMode('login')} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '100px', cursor: 'pointer', fontWeight: 600 }}>
                  Voltar
                </button>
                <button type="submit" className="button-primary" style={{ flex: 1, padding: '14px' }}>
                  Concluir Cadastro
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' };
