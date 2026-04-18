import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, User, Settings } from 'lucide-react';
import { StringerDashboard } from './components/StringerDashboard';
import { CustomerFeedback } from './components/CustomerFeedback';
import { RacketCollection } from './components/RacketCollection';
import { ClassManagementProfessor } from './components/ClassManagementProfessor';
import { ClassManagementCustomer } from './components/ClassManagementCustomer';
import { CustomerSingleClass } from './components/CustomerSingleClass';
import { ProfessorSingleClass } from './components/ProfessorSingleClass';
import ernestoImg from './assets/miami-open-ernesto.jpg';
import racketCollectionImg from './assets/racket-collection.jpg';
import brandLogo from './assets/techtennis-logo.png';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed',
      top: '20px', left: '50%', transform: 'translateX(-50%)',
      width: '90%', maxWidth: '1200px', zIndex: 50,
      background: 'rgba(0, 145, 210, 0.15)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-light)',
      borderRadius: '100px',
      padding: '12px 32px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={brandLogo} alt="TechTennis Pro Stringer Logo" style={{ 
              height: '72px', 
              objectFit: 'contain',
              mixBlendMode: 'multiply'
            }} />
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
          {isSearchOpen && (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                   alert('Busca ativada para: ' + searchQuery);
                   setSearchQuery('');
                   setIsSearchOpen(false);
                }
              }}
              style={{
                padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none'
              }}
              autoFocus
              onBlur={() => !searchQuery && setIsSearchOpen(false)}
            />
          )}
          <Search size={22} color="var(--text-primary)" style={{ cursor: 'pointer' }} onClick={() => setIsSearchOpen(!isSearchOpen)} />
          
          <div style={{ position: 'relative' }}>
            <User size={22} color="var(--text-primary)" style={{ cursor: 'pointer' }} onClick={() => setIsProfileOpen(!isProfileOpen)} />
            {isProfileOpen && (
              <div style={{
                position: 'absolute', top: '40px', right: '0',
                background: 'white', borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: '180px'
              }}>
                <button 
                  onClick={() => { alert('Troca de senha enviada para seu e-mail.'); setIsProfileOpen(false); }}
                  style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: '1px solid #eee', fontWeight: 600, color: '#1a1a2e' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  Trocar Senha
                </button>
                <button 
                  onClick={() => { alert('Deslogando do sistema...'); setIsProfileOpen(false); window.location.reload(); }}
                  style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600, color: '#EF4444' }}
                  onMouseOver={e => e.currentTarget.style.background = '#fcf0f0'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  Sair (Logout)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- NTC Style Tile Component ---
interface HomeTileProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  onClick: () => void;
  fullWidth?: boolean;
  backgroundPosition?: string;
  backgroundSize?: string;
  textPosition?: 'left' | 'right';
}

const HomeTile: React.FC<HomeTileProps> = ({ title, subtitle, backgroundImage, onClick, fullWidth, backgroundPosition, backgroundSize, textPosition }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: '24px', 
        overflow: 'hidden',
        cursor: 'pointer',
        height: fullWidth ? '320px' : '260px',
        gridColumn: fullWidth ? '1 / -1' : 'span 1',
        boxShadow: '0 10px 40px rgba(0, 12, 60, 0.4)'
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: backgroundSize || 'cover',
        backgroundPosition: backgroundPosition || 'center',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0, 12, 60, 0) 0%, rgba(0, 12, 60, 0) 40%, rgba(0, 12, 60, 0.9) 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '24px', left: '24px', right: '24px',
        display: 'flex', flexDirection: 'column', gap: '4px',
        alignItems: textPosition === 'right' ? 'flex-end' : 'flex-start',
        textAlign: textPosition === 'right' ? 'right' : 'left'
      }}>
        {subtitle && <span style={{ color: 'var(--primary-color)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{subtitle}</span>}
        <h3 style={{
          color: '#fff', fontSize: fullWidth ? '32px' : '24px',
          fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase',
          lineHeight: 1.1
        }}>{title}</h3>
      </div>
    </motion.div>
  );
};

// --- Main Home Screen ---
type UserProfile = 'ENCORDOADOR' | 'PROFESSOR' | 'CLIENTE';

const Hero = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>('ENCORDOADOR');

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '160px 5% 60px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      
      {/* Profile Switcher */}
      <div className="glass-panel" style={{ 
        padding: '16px', marginBottom: '32px', display: 'flex', 
        alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-panel-solid)', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={20} color="var(--primary-color)" />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Modo de Visualização:</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,12,60,0.5)', padding: '6px', borderRadius: '100px' }}>
          {(['ENCORDOADOR', 'PROFESSOR', 'CLIENTE'] as UserProfile[]).map(p => (
            <button
              key={p}
              onClick={() => setProfile(p)}
              style={{
                padding: '8px 16px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                background: profile === p ? 'var(--primary-color)' : 'transparent',
                color: profile === p ? 'var(--text-dark)' : 'var(--text-primary)',
                fontWeight: 700, fontSize: '14px', transition: 'all 0.3s'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <h1 style={{ fontSize: '32px', marginBottom: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
        BEM-VINDO A TECHTENNIS
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        
        {/* ENCORDOADOR (Master) */}
        {profile === 'ENCORDOADOR' && (
          <>
            <HomeTile 
              title="Gestão de Encordoamento" subtitle="Acesso Master" fullWidth
              backgroundImage={ernestoImg} backgroundPosition="left 35%" textPosition="right"
              onClick={() => navigate('/stringer')}
            />
            <HomeTile 
              title="Coleta de Raquetes" subtitle="Controle e Extrato"
              backgroundImage={racketCollectionImg} backgroundPosition="center 30%"
              onClick={() => navigate('/racket-collection', { state: { role: 'ENCORDOADOR' } })}
            />
            <HomeTile 
              title="Gestão de Aulas" subtitle="Dashboard"
              backgroundImage="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop"
              onClick={() => navigate('/classes-professor')}
            />
            <HomeTile 
              title="Aulas Avulsas" subtitle="Visão Professor"
              backgroundImage="https://images.unsplash.com/photo-1530915534664-4ac6423816b7?q=80&w=1500&auto=format&fit=crop"
              onClick={() => navigate('/professor-single-class')}
            />
            <HomeTile 
              title="Buscar Aula Avulsa" subtitle="Visão Aluno"
              backgroundImage="https://images.unsplash.com/photo-1530915534664-4ac6423816b7?q=80&w=1500&auto=format&fit=crop"
              onClick={() => navigate('/customer-single-class')}
            />
          </>
        )}

        {/* PROFESSOR DE TÊNIS */}
        {profile === 'PROFESSOR' && (
          <>
            <HomeTile 
              title="Coleta de Raquetes" subtitle="Apoio aos Alunos" fullWidth
              backgroundImage={racketCollectionImg} backgroundPosition="center 30%"
              onClick={() => navigate('/racket-collection', { state: { role: 'PROFESSOR' } })}
            />
            <HomeTile 
              title="Gestão de Aulas" subtitle="Agenda Completa"
              backgroundImage="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop"
              onClick={() => navigate('/classes-professor')}
            />
            <HomeTile 
              title="Meu Encordoamento" subtitle="Equipamento Pessoal"
              backgroundImage={ernestoImg} backgroundPosition="left 35%" textPosition="right"
              onClick={() => navigate('/feedback')}
            />
            <HomeTile 
              title="Aulas Avulsas" subtitle="Novas Solicitações"
              backgroundImage="https://images.unsplash.com/photo-1530915534664-4ac6423816b7?q=80&w=1500&auto=format&fit=crop"
              onClick={() => navigate('/professor-single-class')}
            />
          </>
        )}

        {/* CLIENTE FINAL */}
        {profile === 'CLIENTE' && (
          <>
            <HomeTile 
              title="Meu Encordoamento" subtitle="Histórico & Feedback" fullWidth
              backgroundImage={ernestoImg} backgroundPosition="left 35%" textPosition="right"
              onClick={() => navigate('/feedback')}
            />
            <HomeTile 
              title="Gestão de Aulas" subtitle="Meus Agendamentos"
              backgroundImage="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop"
              onClick={() => navigate('/classes-customer')}
            />
            <HomeTile 
              title="Buscar Aula Avulsa" subtitle="Treine Hoje"
              backgroundImage="https://images.unsplash.com/photo-1530915534664-4ac6423816b7?q=80&w=1500&auto=format&fit=crop"
              onClick={() => navigate('/customer-single-class')}
            />
          </>
        )}
      </div>

    </div>
  );
};

function App() {
  useEffect(() => {
    const handleWheel = () => {
      if (document.activeElement?.tagName === 'INPUT' && (document.activeElement as HTMLInputElement).type === 'number') {
        (document.activeElement as HTMLElement).blur();
      }
    };
    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <Router>
      <div className="page-container">
        
        {/* Tennis Court Background SVG */}
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-15deg)',
          opacity: 0.15,
          zIndex: -1,
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '150vw',
          height: '150vh',
          overflow: 'hidden'
        }}>
          <svg viewBox="-20 -20 400 820" style={{ width: '80%', height: '150%', minWidth: '800px' }} stroke="#ffffff" strokeWidth="3" fill="none">
             {/* Outer Boundary (Doubles) */}
             <rect x="0" y="0" width="360" height="780" />
             {/* Singles sidelines */}
             <line x1="45" y1="0" x2="45" y2="780" />
             <line x1="315" y1="0" x2="315" y2="780" />
             {/* Net */}
             <line x1="-20" y1="390" x2="380" y2="390" strokeWidth="6" stroke="#ffffff" opacity="0.8" />
             {/* Service Lines */}
             <line x1="45" y1="180" x2="315" y2="180" />
             <line x1="45" y1="600" x2="315" y2="600" />
             {/* Center Service Line */}
             <line x1="180" y1="180" x2="180" y2="600" />
             {/* Center Marks */}
             <line x1="180" y1="0" x2="180" y2="15" />
             <line x1="180" y1="765" x2="180" y2="780" />
          </svg>
        </div>

        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/stringer" element={<StringerDashboard />} />
            <Route path="/feedback" element={<CustomerFeedback />} />
            <Route path="/racket-collection" element={<RacketCollection />} />
            <Route path="/classes-professor" element={<ClassManagementProfessor />} />
            <Route path="/classes-customer" element={<ClassManagementCustomer />} />
            <Route path="/customer-single-class" element={<CustomerSingleClass />} />
            <Route path="/professor-single-class" element={<ProfessorSingleClass />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
