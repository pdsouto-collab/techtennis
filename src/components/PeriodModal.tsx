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

  const getFormattedDate = (date: Date) => {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000))
    return date.toISOString().split('T')[0]
  };

  const handleApply = () => {
    if (onApply) onApply({ startDate, endDate });
    onClose();
  };

  const setRange = (type: string) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch(type) {
      case 'Hoje':
        break;
      case 'Ontem':
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case 'Última semana':
        const dayOfWeek = today.getDay() || 7;
        end.setDate(today.getDate() - dayOfWeek);
        start.setDate(end.getDate() - 6);
        break;
      case 'Último mês':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'Últimos 7 dias':
        start.setDate(today.getDate() - 7);
        break;
      case 'Últimos 30 dias':
        start.setDate(today.getDate() - 30);
        break;
      case 'Últimos 180 dias':
        start.setDate(today.getDate() - 180);
        break;
      case 'Ano atual':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      case 'Ano passado':
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
    }

    setStartDate(getFormattedDate(start));
    setEndDate(getFormattedDate(end));
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



          <div style={{ borderTop: '1px solid #E5E7EB', margin: '32px 0 24px 0' }} />

          {/* Quick Picks */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button onClick={() => setRange('Hoje')} style={quickPickStyle}>Hoje</button>
            <button onClick={() => setRange('Ontem')} style={quickPickStyle}>Ontem</button>
            <button onClick={() => setRange('Última semana')} style={quickPickStyle}>Última semana</button>
            <button onClick={() => setRange('Último mês')} style={quickPickStyle}>Último mês</button>
            <button onClick={() => setRange('Últimos 7 dias')} style={quickPickStyle}>Últimos 7 dias</button>
            <button onClick={() => setRange('Últimos 30 dias')} style={quickPickStyle}>Últimos 30 dias</button>
            <button onClick={() => setRange('Últimos 180 dias')} style={quickPickStyle}>Últimos 180 dias</button>
            <button onClick={() => setRange('Ano atual')} style={quickPickStyle}>Ano atual</button>
            <button onClick={() => setRange('Ano passado')} style={quickPickStyle}>Ano passado</button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
