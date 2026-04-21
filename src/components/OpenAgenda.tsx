import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Phone, Activity, Clock, Plus, ArrowLeft, Trash2, Edit } from 'lucide-react';

interface AgendaSlot {
  id: string;
  professorName: string;
  timeAndDay: string;
  region: string;
  price: string;
  type: 'fixo' | 'avulso';
  trainingTypes: string;
  phone: string;
}

export const OpenAgenda = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'CLIENTE';

  const [slots, setSlots] = useState<AgendaSlot[]>(() => {
    const saved = localStorage.getItem('tt_open_slots');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [professorName, setProfessorName] = useState('');
  const [timeAndDay, setTimeAndDay] = useState('');
  const [region, setRegion] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'fixo' | 'avulso'>('fixo');
  const [trainingTypes, setTrainingTypes] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    localStorage.setItem('tt_open_slots', JSON.stringify(slots));
  }, [slots]);

  const resetForm = () => {
    setProfessorName('');
    setTimeAndDay('');
    setRegion('');
    setPrice('');
    setType('fixo');
    setTrainingTypes('');
    setPhone('');
    setEditingId(null);
  };

  const openForm = (slot?: AgendaSlot) => {
    if (slot) {
      setProfessorName(slot.professorName);
      setTimeAndDay(slot.timeAndDay);
      setRegion(slot.region);
      setPrice(slot.price);
      setType(slot.type);
      setTrainingTypes(slot.trainingTypes);
      setPhone(slot.phone);
      setEditingId(slot.id);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: AgendaSlot = {
      id: editingId || Date.now().toString(),
      professorName,
      timeAndDay,
      region,
      price,
      type,
      trainingTypes,
      phone
    };

    if (editingId) {
      setSlots(prev => prev.map(s => s.id === editingId ? newSlot : s));
    } else {
      setSlots(prev => [newSlot, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja apagar este anúncio?")) {
      setSlots(prev => prev.filter(s => s.id !== id));
    }
  };

  const canEdit = (slot: AgendaSlot) => {
    if (role === 'ENCORDOADOR') return true;
    if (role === 'PROFESSOR') return true; // Idealmente verificaria se o nome bate, mas vamos permitir edição a todos os professores por enquanto
    return false;
  };

  const canCreate = role === 'ENCORDOADOR' || role === 'PROFESSOR';

  return (
    <div style={{ paddingTop: '140px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}>
              <ArrowLeft size={28} />
            </button>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Agenda Aberta
            </h1>
          </div>
          {canCreate && (
            <button 
              onClick={() => openForm()}
              className="button-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '100px', fontWeight: 600 }}
            >
              <Plus size={20} /> Novo Anúncio
            </button>
          )}
        </div>

        {/* List of Slots */}
        {slots.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Nenhum horário disponível publicado no momento.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {slots.map(slot => (
              <motion.div 
                key={slot.id}
                whileHover={{ scale: 1.02 }}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Visual Type Indicator Banner */}
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                  background: slot.type === 'fixo' ? '#3B82F6' : '#22C55E' // Azul para Fixo, Verde para Avulso
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'white' }}>{slot.professorName}</h3>
                    
                    {/* Tags */}
                    <div style={{ display: 'inline-block', marginTop: '8px', padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700,
                      background: slot.type === 'fixo' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      color: slot.type === 'fixo' ? '#60A5FA' : '#4ADE80'
                    }}>
                      {slot.type === 'fixo' ? '🔵 Horário Fixo' : '🟢 Horário Avulso'}
                    </div>
                  </div>
                  
                  {canEdit(slot) && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openForm(slot)} style={{ background: 'transparent', border: 'none', color: '#60A5FA', cursor: 'pointer' }}><Edit size={18} /></button>
                      <button onClick={() => handleDelete(slot.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <Calendar size={16} /> <span>{slot.timeAndDay}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <MapPin size={16} /> <span>{slot.region}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <Activity size={16} /> <span>{slot.trainingTypes}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <Phone size={16} /> <span>{slot.phone}</span>
                  </div>
                  {slot.price && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FCD34D', fontSize: '15px', fontWeight: 600, marginTop: '4px' }}>
                      <DollarSign size={16} /> <span>{slot.price}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        <AnimatePresence>
          {isModalOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
              
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative', zIndex: 101 }}>
                <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>{editingId ? 'Editar Anúncio' : 'Novo Anúncio de Horário'}</h2>
                
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Nome do Professor</label>
                    <input type="text" value={professorName} onChange={e => setProfessorName(e.target.value)} required style={inputStyle} placeholder="Ex: Lucas Silva" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Tipo de Agenda</label>
                      <select value={type} onChange={e => setType(e.target.value as 'fixo' | 'avulso')} style={inputStyle}>
                        <option value="fixo">Horário Fixo (Recorrente)</option>
                        <option value="avulso">Horário Avulso</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Horário e Dia da Semana</label>
                      <input type="text" value={timeAndDay} onChange={e => setTimeAndDay(e.target.value)} required style={inputStyle} placeholder="Ex: Terças 19h-20h / Dia 15 às 10h" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Região</label>
                    <input type="text" value={region} onChange={e => setRegion(e.target.value)} required style={inputStyle} placeholder="Ex: Alphaville, Zona Oeste SP" />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Tipos de Treino</label>
                    <input type="text" value={trainingTypes} onChange={e => setTrainingTypes(e.target.value)} required style={inputStyle} placeholder="Ex: Treino Competitivo, Rebatedor, Tático" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Valor (Opcional)</label>
                      <input type="text" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} placeholder="Ex: R$ 150,00" />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Celular (WhatsApp)</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required style={inputStyle} placeholder="(11) 99999-9999" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
                    <button type="submit" className="button-primary" style={{ padding: '12px 32px' }}>{editingId ? 'Salvar Alterações' : 'Publicar Anúncio'}</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' };
