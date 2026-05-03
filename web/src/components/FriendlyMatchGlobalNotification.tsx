import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const FriendlyMatchGlobalNotification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [matchFound, setMatchFound] = useState<any>(null);

  useEffect(() => {
    const checkRadar = () => {
      const isActive = localStorage.getItem('tt_radar_amistoso_active') === 'true';
      const hasMatch = localStorage.getItem('tt_radar_amistoso_match');
      
      if (isActive && !hasMatch && !matchFound) {
        // Simulate finding a match after 10-15 seconds of being active
        const lastActiveTime = localStorage.getItem('tt_radar_amistoso_time');
        if (lastActiveTime) {
          const elapsed = Date.now() - parseInt(lastActiveTime, 10);
          if (elapsed > 12000) { // 12 seconds simulation
            const fakeMatch = {
              name: 'Carlos Alcaraz',
              level: 'A',
              distance: '4.5km',
              court: 'Possui Quadra'
            };
            setMatchFound(fakeMatch);
            localStorage.setItem('tt_radar_amistoso_match', JSON.stringify(fakeMatch));
          }
        }
      } else if (hasMatch && !matchFound) {
        setMatchFound(JSON.parse(hasMatch));
      } else if (!isActive && matchFound) {
        setMatchFound(null);
      }
    };

    const interval = setInterval(checkRadar, 2000);
    return () => clearInterval(interval);
  }, [matchFound]);

  // If the user is ALREADY on the friendly match screen, don't show the global popup
  if (!matchFound || location.pathname === '/friendly-match') return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999 }}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={() => {
            navigate('/friendly-match');
          }}
          style={{
            background: 'var(--bg-panel)',
            border: '2px solid #38D430',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(56, 212, 48, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{
            background: 'rgba(56, 212, 48, 0.1)',
            width: '48px', height: '48px',
            borderRadius: '50%',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <UserCheck size={24} color="#38D430" />
          </div>
          <div>
            <h4 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '16px' }}>
              Adversário Encontrado!
            </h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '13px' }}>
              {matchFound.name} está a {matchFound.distance}. Clique aqui!
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
