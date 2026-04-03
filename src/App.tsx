import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Menu, ArrowRight, User } from 'lucide-react';

const Navbar = () => (
  <nav style={{
    position: 'fixed',
    top: '20px', left: '50%', transform: 'translateX(-50%)',
    width: '90%', maxWidth: '1200px', zIndex: 50,
    background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(16px)',
    border: '1px solid var(--border-light)',
    borderRadius: '100px',
    padding: '12px 32px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-color)', color: 'var(--bg-gradient-bottom)', borderRadius: '50%', width: '32px', height: '32px', marginRight: '8px', fontSize: '18px' }}>T</span>
          TechTennis
        </Link>
      </div>
      
      {/* Center Links */}
      <div style={{ display: 'flex', gap: '32px' }} className="nav-links">
        <Link to="/racquets" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Equipment</Link>
        <Link to="/matches" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Live Scoring</Link>
        <Link to="/training" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Coach AI</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Search size={22} color="var(--text-primary)" style={{ cursor: 'pointer' }} />
        <User size={22} color="var(--text-primary)" style={{ cursor: 'pointer' }} />
        <Menu size={24} color="var(--text-primary)" style={{ cursor: 'pointer' }} />
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    padding: '140px 5% 60px',
    position: 'relative'
  }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 0.8fr', gap: '64px', zIndex: 1, position: 'relative', alignItems: 'center', width: '100%' }}>
      
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{ 
          display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.2)', 
          borderRadius: '100px', border: '1px solid rgba(255,255,255,0.4)', marginBottom: '24px',
          fontWeight: 600, fontSize: '14px', letterSpacing: '1px'
        }}>
          AO OFFICIAL PARTNER
        </div>
        <h1 style={{ fontSize: 'clamp(56px, 6vw, 96px)', lineHeight: 1.05, marginBottom: '24px' }}>
          Advance<br/>
          Your <span style={{ fontWeight: 800 }}>Game</span>
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '85%', lineHeight: 1.5 }}>
          Analyze your progress, set new goals, and improve your skills with advanced AI tracking and live tournament scores.
        </p>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="button-primary">
            Get Started <ArrowRight size={20} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="button-secondary">
            View Live Scores
          </motion.button>
        </div>
      </motion.div>

      {/* Glass Mockup Area resembling the attached image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}
      >
        {/* Main Phone Mockup */}
        <div className="glass-panel" style={{ 
          width: '320px', height: '640px', padding: '24px', 
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
          boxShadow: '0 24px 60px rgba(0,0,255,0.1)'
        }}>
           <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 600, marginTop: '20px' }}>Match Live</h3>
              <div style={{ marginTop: '40px', width: '100%', background: 'rgba(255,255,255,0.8)', borderRadius: '24px', padding: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                   <div style={{ fontWeight: 600, color: '#1e293b' }}>USA</div>
                   <div style={{ fontWeight: 400, color: '#64748b', fontSize: '14px' }}>VS</div>
                   <div style={{ fontWeight: 600, color: '#1e293b' }}>ARG</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>70</div>
                   <div style={{ background: '#d8f533', color: '#1e293b', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>LIVE</div>
                   <div style={{ fontSize: '32px', fontWeight: 800, color: '#64748b' }}>14</div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', width: '100%', padding: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '24px', backdropFilter: 'blur(20px)' }}>
                 <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Advanced AI Shot Coach</p>
                 <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.5)', padding: '12px', borderRadius: '16px', flex: 1, textAlign: 'center', color: '#1e293b', fontWeight: 700 }}>81%</div>
                    <div style={{ background: 'rgba(255,255,255,0.5)', padding: '12px', borderRadius: '16px', flex: 1, textAlign: 'center', color: '#1e293b', fontWeight: 700 }}>78%</div>
                    <div style={{ background: 'rgba(255,255,255,0.5)', padding: '12px', borderRadius: '16px', flex: 1, textAlign: 'center', color: '#1e293b', fontWeight: 700 }}>92%</div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>

    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="page-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Hero />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
