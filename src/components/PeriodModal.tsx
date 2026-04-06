import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const PeriodModal = ({ isOpen, onClose, onApply }: any) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  const quickPickStyle = {
    background: '#4298E7',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px'
  };

  const handleApply = () => {
    if (onApply) onApply({ startDate, endDate });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%', maxWidth: '700px', background: 'white',
          borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#111827' }}>Período</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 24px' }}>
          
          {/* Custom Date Inputs */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#F0F7FF', fontSize: '15px' }} 
              />
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#F0F7FF', fontSize: '15px' }} 
              />
            </div>
            <button onClick={handleApply} style={{ background: '#6FCF97', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
              Aplicar
            </button>
          </div>

          <div style={{ marginTop: '16px', marginBottom: '32px' }}>
             <button style={{ background: 'none', border: 'none', color: '#4298E7', fontSize: '15px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
               Adicionar período de comparação
             </button>
          </div>

          <div style={{ borderTop: '1px solid #E5E7EB', margin: '32px 0 24px 0' }} />

          {/* Quick Picks */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button style={quickPickStyle}>Hoje</button>
            <button style={quickPickStyle}>Ontem</button>
            <button style={quickPickStyle}>Última semana</button>
            <button style={quickPickStyle}>Último mês</button>
            <button style={quickPickStyle}>Últimos 7 dias</button>
            <button style={quickPickStyle}>Últimos 30 dias</button>
            <button style={quickPickStyle}>Últimos 180 dias</button>
            <button style={quickPickStyle}>Ano atual</button>
            <button style={quickPickStyle}>Ano passado</button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
