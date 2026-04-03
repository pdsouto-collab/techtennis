import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Menu, User, Settings } from 'lucide-react';
import { StringerDashboard } from './components/StringerDashboard';
import { CustomerFeedback } from './components/CustomerFeedback';
import ernestoImg from './assets/miami-open-ernesto.jpg';

const Navbar = () => (
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
        <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-color)', color: 'var(--text-dark)', borderRadius: '50%', width: '32px', height: '32px', marginRight: '8px', fontSize: '18px' }}>T</span>
          TechTennis
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Search size={22} color="var(--text-primary)" style={{ cursor: 'pointer' }} />
        <User size={22} color="var(--text-primary)" style={{ cursor: 'pointer' }} />
        <Menu size={24} color="var(--text-primary)" style={{ cursor: 'pointer' }} />
      </div>
    </div>
  </nav>
);

// --- NTC Style Tile Component ---
interface HomeTileProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  onClick: () => void;
  fullWidth?: boolean;
  backgroundPosition?: string;
  backgroundSize?: string;
}

const HomeTile: React.FC<HomeTileProps> = ({ title, subtitle, backgroundImage, onClick, fullWidth, backgroundPosition, backgroundSize }) => {
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
        display: 'flex', flexDirection: 'column', gap: '4px'
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
      padding: '120px 5% 60px',
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
              backgroundImage={ernestoImg} backgroundPosition="left 35%" backgroundSize="130%"
              onClick={() => navigate('/stringer')}
            />
            <HomeTile 
              title="Coleta de Raquetes" subtitle="Logística"
              backgroundImage="https://images.unsplash.com/photo-1542144582-1ba004ac6b53?q=80&w=800&auto=format&fit=crop"
              onClick={() => {}}
            />
            <HomeTile 
              title="Gestão de Aulas" subtitle="Dashboard"
              backgroundImage="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop"
              onClick={() => {}}
            />
            <HomeTile 
              title="Aulas Avulsas" subtitle="Marketplace" fullWidth
              backgroundImage="https://images.unsplash.com/photo-1530915534664-4ac6423816b7?q=80&w=1500&auto=format&fit=crop"
              onClick={() => {}}
            />
          </>
        )}

        {/* PROFESSOR DE TÊNIS */}
        {profile === 'PROFESSOR' && (
          <>
            <HomeTile 
              title="Aulas Avulsas" subtitle="Novas Solicitações" fullWidth
              backgroundImage="https://images.unsplash.com/photo-1605295484803-fdccaa22d56d?q=80&w=1500&auto=format&fit=crop"
              onClick={() => {}}
            />
            <HomeTile 
              title="Gestão de Aulas" subtitle="Agenda Completa"
              backgroundImage="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop"
              onClick={() => {}}
            />
            <HomeTile 
              title="Meu Encordoamento" subtitle="Equipamento Pessoal"
              backgroundImage={ernestoImg} backgroundPosition="left 35%" backgroundSize="130%"
              onClick={() => navigate('/stringer')}
            />
            <HomeTile 
              title="Coleta de Raquetes" subtitle="Apoio aos Alunos"
              backgroundImage="https://images.unsplash.com/photo-1542144582-1ba004ac6b53?q=80&w=800&auto=format&fit=crop"
              onClick={() => {}}
            />
          </>
        )}

        {/* CLIENTE FINAL */}
        {profile === 'CLIENTE' && (
          <>
            <HomeTile 
              title="Meu Encordoamento" subtitle="Histórico & Feedback" fullWidth
              backgroundImage={ernestoImg} backgroundPosition="left 35%" backgroundSize="130%"
              onClick={() => navigate('/feedback')}
            />
            <HomeTile 
              title="Buscar Aula Avulsa" subtitle="Treine Hoje"
              backgroundImage="https://images.unsplash.com/photo-1518606016146-527bf14e5b72?q=80&w=800&auto=format&fit=crop"
              onClick={() => {}}
            />
            <HomeTile 
              title="Gestão de Aulas" subtitle="Meus Agendamentos"
              backgroundImage="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop"
              onClick={() => {}}
            />
          </>
        )}
      </div>

    </div>
  );
};

function App() {
  return (
    <Router basename="/techtennis">
      <div className="page-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/stringer" element={<StringerDashboard />} />
            <Route path="/feedback" element={<CustomerFeedback />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
