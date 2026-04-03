import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Menu } from 'lucide-react';
import { StringerDashboard } from './components/StringerDashboard';
import { CustomerFeedback } from './components/CustomerFeedback';

const Navbar = () => (
  <nav style={{
    position: 'absolute',
    top: 0, left: 0, right: 0,
    width: '100%', zIndex: 50,
    padding: '24px 20px',
    background: 'transparent'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Back/Menu Icon (Simulating left action) */}
      <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
         <Menu color="#ffffff" size={24} />
      </div>

      {/* Center Logo */}
      <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-1px' }}>
        T<span style={{ fontSize: '32px', opacity: 0.9 }}>T</span>
      </Link>

      {/* Right User Icon */}
      <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
         <User color="#ffffff" size={24} />
      </div>
    </div>
  </nav>
);

// --- Circular Story Component ---
interface StoryCircleProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  onClick: () => void;
}

const StoryCircle: React.FC<StoryCircleProps> = ({ title, subtitle, imageUrl, onClick }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '90px', gap: '8px' }}
    >
      <div style={{
        width: '84px', height: '84px',
        borderRadius: '50%',
        padding: '3px',
        background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#000',
          position: 'relative'
        }}>
           <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
        </div>
      </div>
      <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
        <p style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{title}</p>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 500 }}>{subtitle}</p>
      </div>
    </motion.div>
  );
};

// --- Main Home Screen ---
const Hero = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingTop: '100px',
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Horizontal Stories Row */}
      <div style={{
        display: 'flex', gap: '16px', overflowX: 'auto', padding: '0 20px 24px',
        scrollbarWidth: 'none', msOverflowStyle: 'none'
      }} className="hide-scroll">
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scroll::-webkit-scrollbar { display: none; }
        `}} />
        
        <StoryCircle 
          title="Encordoar" subtitle="Registro Master"
          imageUrl="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=300&auto=format&fit=crop"
          onClick={() => navigate('/stringer')}
        />
        <StoryCircle 
          title="Feedback" subtitle="Sua Avaliação"
          imageUrl="https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?q=80&w=300&auto=format&fit=crop"
          onClick={() => navigate('/feedback')}
        />
        <StoryCircle 
          title="Trophy Time" subtitle="Últimas Finais"
          imageUrl="https://images.unsplash.com/photo-1542144582-1ba004ac6b53?q=80&w=300&auto=format&fit=crop"
          onClick={() => {}}
        />
        <StoryCircle 
          title="Match Live" subtitle="Resultados ATP"
          imageUrl="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=300&auto=format&fit=crop"
          onClick={() => {}}
        />
      </div>

      <div style={{ padding: '20px 24px', textAlign: 'center', zIndex: 10 }}>
        {/* Main Title replicating the white bold reference */}
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 800, 
          color: '#ffffff', 
          fontFamily: 'var(--font-heading)',
          textTransform: 'uppercase',
          lineHeight: 1.2
        }}>
          GERENCIE O SEU<br/>
          CICLO DE JOGO!
        </h1>
      </div>

      {/* Overlapping Player Cut-out Image */}
      {/* We use a high-quality pre-cut transparent PNG from external sources representing players/champions */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          pointerEvents: 'none',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1
        }}
      >
        {/* Transparent PNG of isolated tennis players / equipment. Using a known tennis player isolated PNG link */}
        <img 
          src="https://pngimg.com/uploads/tennis/tennis_PNG10385.png" 
          alt="Tennis Champions" 
          style={{ width: '130%', maxWidth: '700px', height: 'auto', objectFit: 'contain', objectPosition: 'bottom', transform: 'translateY(10%)' }} 
        />
      </motion.div>

    </div>
  );
};

function App() {
  return (
    <Router basename="/techtennis">
      <div className="page-container" style={{ background: 'linear-gradient(180deg, var(--bg-gradient-top) 0%, var(--bg-gradient-bottom) 100%)', minHeight: '100vh' }}>
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
