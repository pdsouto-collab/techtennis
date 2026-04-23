import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const AddPrepaidModal = ({ isOpen, onClose, onApply }: any) => {
  const [numStringings, setNumStringings] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1100,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%', maxWidth: '500px', background: 'white',
          borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#111827' }}>Adicionar pré-pago</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '8px' }}>Número de encordoamentos</label>
              <input type="number" placeholder="Número de encordoamentos" value={numStringings} onChange={e => setNumStringings(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#F0F7FF', fontSize: '15px' }} />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '8px' }}>Valor</label>
              <input type="number" placeholder="Valor" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#F0F7FF', fontSize: '15px' }} />
            </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', background: '#F9FAFB' }}>
            <button onClick={() => { if(onApply) onApply({ numStringings, amount }); onClose(); }} style={{ background: '#4298E7', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
              Adicionar pré-pago
            </button>
        </div>
      </motion.div>
    </div>
  );
};
