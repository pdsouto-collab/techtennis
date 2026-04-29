import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GlobalRadarNotification = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || 'https://techtennis-api.vercel.app';

  useEffect(() => {
    const t = localStorage.getItem('tt_auth_token');
    if (!t) return;

    let interval: any;
    const fetchReqs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/single-class/requests`, {
          headers: { 'Authorization': `Bearer ${t}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPendingRequests(data);
        }
      } catch (e) {}
    };

    // Only run this component's polling if they have a token.
    // Ideally we would only poll if they are online, but doing a quick check on requests is cheap.
    fetchReqs();
    interval = setInterval(fetchReqs, 5000); // Check every 5 seconds globally

    return () => clearInterval(interval);
  }, []);

  if (pendingRequests.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={() => navigate('/single-class-prof')}
          style={{
            background: 'var(--bg-panel)',
            border: '2px solid var(--primary-color)',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            width: '48px', height: '48px',
            borderRadius: '50%',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <Navigation size={24} color="var(--primary-color)" />
          </div>
          <div>
            <h4 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '16px' }}>
              {pendingRequests.length} Novo(s) Aluno(s) no Radar!
            </h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '13px' }}>
              Clique aqui para aceitar e abrir o chat.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
