import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star } from 'lucide-react';

export const FeedbackModal = ({ isOpen, onClose, job, onSaveFeedback, readOnly = false }: any) => {
  const existingFeedback = job?.feedback || {};
  
  const [feedback, setFeedback] = useState({
    tensionMaintenance: existingFeedback.tensionMaintenance || 0,
    power: existingFeedback.power || 0,
    comfort: existingFeedback.comfort || 0,
    spin: existingFeedback.spin || 0,
    control: existingFeedback.control || 0,
    comments: existingFeedback.comments || ''
  });

  if (!isOpen || !job) return null;

  const handleStarClick = (category: string, value: number) => {
    if (readOnly) return;
    setFeedback({ ...feedback, [category]: value });
  };

  const StarRating = ({ category, label }: { category: string, label: string }) => {
    const value = (feedback as any)[category];
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '15px' }}>{label}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              size={24} 
              fill={star <= value ? '#F2C94C' : 'transparent'} 
              color={star <= value ? '#F2C94C' : 'rgba(255,255,255,0.3)'} 
              style={{ cursor: readOnly ? 'default' : 'pointer' }}
              onClick={() => handleStarClick(category, star)}
            />
          ))}
          <span style={{ width: '20px', textAlign: 'right', fontWeight: 700, opacity: 0.5 }}>{value > 0 ? value : '-'}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '24px'
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ width: '100%', maxWidth: '500px', background: '#5E88D6', color: 'white', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '32px 32px 16px 32px', textAlign: 'center', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}><X size={24} /></button>
          <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 8px 0' }}>Sua Experiência</h2>
          <p style={{ fontSize: '14px', margin: 0, color: 'rgba(255,255,255,0.8)' }}>
            Avalie o encordoamento: {job.racketModel} a {job.tension}
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 32px', background: 'rgba(255,255,255,0.1)', flex: 1, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <StarRating category="tensionMaintenance" label="Manutenção de Tensão" />
          <StarRating category="power" label="Potência" />
          <StarRating category="comfort" label="Conforto" />
          <StarRating category="spin" label="Spin (Efeito)" />
          <StarRating category="control" label="Controle" />

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>Comentários Adicionais</div>
            <textarea 
              readOnly={readOnly}
              value={feedback.comments}
              onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
              placeholder="Como sentiu a batida? Muito rígida? Sem controle?"
              style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '12px', padding: '16px', color: 'white', resize: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {!readOnly && (
            <button 
              onClick={() => onSaveFeedback(feedback)}
              style={{ background: 'white', color: '#5E88D6', border: 'none', padding: '16px', borderRadius: '100px', fontWeight: 800, fontSize: '16px', marginTop: '24px', cursor: 'pointer' }}
            >
              Enviar Feedback
            </button>
          )}

        </div>
      </motion.div>
    </div>
  );
};
