import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User } from 'lucide-react';
import { StringerDashboard } from './components/StringerDashboard';
import { CustomerFeedback } from './components/CustomerFeedback';
import { RacketCollection } from './components/RacketCollection';
import { ClassManagementProfessor } from './components/ClassManagementProfessor';
import { ClassManagementCustomer } from './components/ClassManagementCustomer';
import { CustomerSingleClass } from './components/CustomerSingleClass';
import { ProfessorSingleClass } from './components/ProfessorSingleClass';
import { OpenAgenda } from './components/OpenAgenda';
import { LoginView } from './components/LoginView';
import { UserManagement } from './components/UserManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import ernestoImg from './assets/miami-open-ernesto.jpg';
import racketCollectionImg from './assets/racket-collection.jpg';
import agendaAbertaImg from './assets/agenda-aberta-bg.jpg';
import brandLogo from './assets/techtennis-logo.png';
import gestaoUsuariosImg from './assets/gestao-usuarios-bg.jpg';

const Navbar = () => {
  const { logout, currentUser, updateProfile } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMyProfileModalOpen, setIsMyProfileModalOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: '20px', left: '50%', transform: 'translateX(-50%)',
        width: '90%', maxWidth: '1200px', zIndex: 50,
        background: 'rgba(60, 42, 99, 0.5)', backdropFilter: 'blur(16px)',
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
                filter: 'brightness(0) invert(1)'
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
                    onClick={() => { setIsMyProfileModalOpen(true); setIsProfileOpen(false); }}
                    style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: '1px solid #eee', fontWeight: 600, color: '#1a1a2e' }}
                    onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Meu Perfil
                  </button>

                  <button 
                    onClick={() => { alert('Deslogando do sistema...'); setIsProfileOpen(false); logout(); }}
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

      <AnimatePresence>
        {isMyProfileModalOpen && currentUser && (
          <ProfileSettingsModal 
            currentUser={currentUser} 
            onClose={() => setIsMyProfileModalOpen(false)} 
            onUpdate={updateProfile} 
          />
        )}
      </AnimatePresence>
    </>
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
        backgroundImage: "url(" + backgroundImage + ")",
        backgroundSize: backgroundSize || 'cover',
        backgroundPosition: backgroundPosition || 'center',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(45, 30, 75, 0) 0%, rgba(45, 30, 75, 0) 40%, rgba(45, 30, 75, 0.9) 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '24px', left: '24px', right: '24px',
        display: 'flex', flexDirection: 'column', gap: '4px',
        alignItems: textPosition === 'right' ? 'flex-end' : 'flex-start',
        textAlign: textPosition === 'right' ? 'right' : 'left'
      }}>
        {subtitle && <span style={{ color: 'var(--secondary-color)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{subtitle}</span>}
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
const Hero = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const profile = currentUser?.role || 'CLIENTE';

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '160px 5% 60px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      
      <h1 style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
        BEM-VINDO A TECHTENNIS
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Logado como {currentUser?.name} | Perfil: <strong style={{ color: 'var(--primary-color)' }}>{profile}</strong>
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        
        {/* ADMIN E ENCORDOADOR */}
        {(profile === 'ADMIN' || profile === 'ENCORDOADOR') && (
          <>
            {profile === 'ADMIN' && (
              <HomeTile 
                title="Configurações de Usuários" subtitle="Gestão de Acessos" fullWidth
                backgroundImage={gestaoUsuariosImg} backgroundPosition="center 40%"
                onClick={() => navigate('/users')}
              />
            )}
            <HomeTile 
              title="Gestão de Encordoamento" subtitle="Acesso Master" { ...(profile !== 'ADMIN' ? { fullWidth: true } : {}) }
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
            <HomeTile 
              title="Agenda Aberta" subtitle="Horários Disponíveis"
              backgroundImage={agendaAbertaImg}
              onClick={() => navigate('/open-agenda', { state: { role: 'ENCORDOADOR' } })}
            />
          </>
        )}

        {/* PROFESSOR DE TÊNIS E PROFESSOR PREMIUM */}
        {(profile === 'PROFESSOR' || profile === 'PROFESSOR_PREMIUM') && (
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
            <HomeTile 
              title="Agenda Aberta" subtitle="Divulgue Seus Horários"
              backgroundImage={agendaAbertaImg}
              onClick={() => navigate('/open-agenda', { state: { role: 'PROFESSOR' } })}
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
            <HomeTile 
              title="Agenda Aberta" subtitle="Horários Disponíveis"
              backgroundImage={agendaAbertaImg}
              onClick={() => navigate('/open-agenda', { state: { role: 'CLIENTE' } })}
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

  const { currentUser } = useAuth();
  if (!currentUser) return <LoginView />;

  return (
    <>
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
            <Route path="/open-agenda" element={<OpenAgenda />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

const WrappedApp = () => (
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
)

export default WrappedApp;
