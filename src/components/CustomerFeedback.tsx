import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

const KPIS = [
  { id: 'tensionMaintenance', label: 'Manutenção de Tensão' },
  { id: 'power', label: 'Potência' },
  { id: 'comfort', label: 'Conforto' },
  { id: 'spin', label: 'Spin (Efeito)' },
  { id: 'control', label: 'Controle' },
];

export const CustomerFeedback = () => {
  const [ratings, setRatings] = useState<Record<string, number>>({
    tensionMaintenance: 0, power: 0, comfort: 0, spin: 0, control: 0
  });
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (kpiId: string, value: number) => {
    setRatings(prev => ({ ...prev, [kpiId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: '80px 24px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ background: 'var(--primary-color)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Check size={32} color="var(--bg-gradient-bottom)" />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text-primary)' }}>Feedback Enviado!</h2>
          <p style={{ color: '#b2c0cc', lineHeight: 1.5 }}>
            Obrigado por avaliar o serviço. Isso ajuda nossa equipe a ajustar as tensões perfeitas para o seu próximo jogo!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 24px 40px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--text-primary)' }}>Sua Experiência</h2>
          <p style={{ color: '#b2c0cc', fontSize: '15px' }}>Avalie o encordoamento: Babolat RPM Blast a 55/53 lbs</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
            {KPIS.map((kpi) => (
              <div key={kpi.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <label style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)' }}>{kpi.label}</label>
                   <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{ratings[kpi.id] ? `${ratings[kpi.id]}/5` : '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star} type="button"
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => handleRating(kpi.id, star)}
                      style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: star <= ratings[kpi.id] ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)'
                      }}
                    >
                      <Star size={32} fill={star <= ratings[kpi.id] ? "currentColor" : "none"} strokeWidth={1.5} />
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)' }}>Comentários Adicionais</label>
            <textarea 
              value={comments} 
              onChange={(e) => setComments(e.target.value)} 
              placeholder="Como sentiu a batida? Muito rígida? Sem controle?"
              rows={4}
              style={{ 
                width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border-light)', color: 'white', resize: 'none', fontSize: '15px' 
              }}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
            className="button-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }} 
            type="submit"
            disabled={Object.values(ratings).some(val => val === 0)}
          >
            Enviar Feedback
          </motion.button>
          
          {Object.values(ratings).some(val => val === 0) && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', marginTop: '12px' }}>
              Por favor, preencha todas as estrelas.
            </p>
          )}

        </form>
      </div>

    </div>
  );
};
