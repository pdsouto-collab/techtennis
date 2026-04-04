import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Plus, ArrowLeft, MoreHorizontal, PackageOpen, Scissors, CheckCircle, UserPlus } from 'lucide-react';

// Extended Mock Data for the new functionalities
const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Rafael Nadal', email: 'rafa@example.com', phone: '+1234567890' },
  { id: 'c2', name: 'Carlos Alcaraz', email: 'carlos@example.com', phone: '+0987654321' }
];

const MOCK_JOBS = [
  { id: 'j3', customerName: 'Rafael Nadal', racketModel: 'Babolat Pure Aero', date: '2026-04-05', tension: '55/53 lbs', status: 'ready', type: 'picking_up' },
  { id: 'j2', customerName: 'Carlos Alcaraz', racketModel: 'Babolat Pure Aero 98', date: '2026-04-06', tension: '50/50 lbs', status: 'pending', type: 'to_string' },
  { id: 'j1', customerName: 'Jannik Sinner', racketModel: 'Head Speed Pro', date: '2026-04-04', tension: '52/52 lbs', status: 'received', type: 'dropping_off' },
];

export const StringerDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'dashboard' | 'new_job' | 'customers'>('dashboard');
  const [activeFilter, setActiveFilter] = useState<'all' | 'dropping_off' | 'to_string' | 'picking_up'>('all');
  
  // Form State
  const [jobSaved, setJobSaved] = useState(false);
  const [mainString, setMainString] = useState('');
  const [crossString, setCrossString] = useState('');
  const [tensionMain, setTensionMain] = useState(55);
  const [tensionCross, setTensionCross] = useState(53);
  const [notes, setNotes] = useState('');

  const filteredJobs = activeFilter === 'all' 
    ? MOCK_JOBS 
    : MOCK_JOBS.filter(job => job.type === activeFilter);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setJobSaved(true);
    setTimeout(() => {
      setJobSaved(false);
      setView('dashboard');
    }, 1500);
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'dropping_off': return '#D93B65'; // Reddish pink
      case 'to_string': return '#F2C94C'; // Yellow
      case 'picking_up': return '#6FCF97'; // Green
      default: return 'var(--primary-color)';
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Navbar / Tabs (Dashboard specific) */}
      <div style={{ 
        width: '100%', maxWidth: '1200px', padding: '0 24px', marginBottom: '24px',
        display: 'flex', gap: '24px', overflowX: 'auto', borderBottom: '1px solid var(--border-light)'
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', padding: '12px 0', 
          color: 'var(--text-secondary)',
          fontWeight: 500, fontSize: '15px',
          borderBottom: '2px solid transparent',
          cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          Início
        </button>
        <button onClick={() => setView('dashboard')} style={{
          background: 'none', border: 'none', padding: '12px 0', 
          color: 'var(--primary-color)',
          fontWeight: 700, fontSize: '15px',
          borderBottom: '2px solid var(--primary-color)',
          cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          Dashboard
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '1200px', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Gestão e Operação</h2>
              <button onClick={() => setView('new_job')} className="button-primary" style={{ padding: '8px 24px', fontSize: '14px' }}>
                <Plus size={18} /> Novo Encordoamento
              </button>
            </div>

            {/* Configurable Status Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" onClick={() => setActiveFilter('dropping_off')}
                style={{ padding: '20px', cursor: 'pointer', borderLeft: `4px solid ${getStatusColor('dropping_off')}`, background: activeFilter === 'dropping_off' ? 'rgba(255,255,255,0.2)' : 'var(--bg-panel)' }}>
                <PackageOpen size={24} color={getStatusColor('dropping_off')} style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recebimento</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Raquetes chegando</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" onClick={() => setActiveFilter('to_string')}
                style={{ padding: '20px', cursor: 'pointer', borderLeft: `4px solid ${getStatusColor('to_string')}`, background: activeFilter === 'to_string' ? 'rgba(255,255,255,0.2)' : 'var(--bg-panel)' }}>
                <Scissors size={24} color={getStatusColor('to_string')} style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Para Encordoar: {MOCK_JOBS.filter(j => j.type === 'to_string').length}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Fila de trabalho</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" onClick={() => setActiveFilter('picking_up')}
                style={{ padding: '20px', cursor: 'pointer', borderLeft: `4px solid ${getStatusColor('picking_up')}`, background: activeFilter === 'picking_up' ? 'rgba(255,255,255,0.2)' : 'var(--bg-panel)' }}>
                <CheckCircle size={24} color={getStatusColor('picking_up')} style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Para Retirar: {MOCK_JOBS.filter(j => j.type === 'picking_up').length}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Prontas</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" onClick={() => setView('customers')}
                style={{ padding: '20px', cursor: 'pointer', borderLeft: `4px solid #9B51E0` }}>
                <Users size={24} color="#9B51E0" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Clientes</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Base de dados</p>
              </motion.div>
            </div>

            {/* Calendar / List View Header */}
            <div className="glass-panel" style={{ padding: '24px', minHeight: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '20px', fontWeight: 700 }}>
                  {activeFilter === 'all' ? 'Todos os Pedidos' : 
                   activeFilter === 'dropping_off' ? 'A Receber' :
                   activeFilter === 'to_string' ? 'Fila de Encordoamento' : 'Prontos para Retirada'}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setActiveFilter('all')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px 12px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>Ver Todos</button>
                  <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px 12px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>Dia</button>
                  <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '6px 12px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>Lista</button>
                </div>
              </div>

              {/* Jobs List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredJobs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Nenhum evento para exibir</div>
                ) : (
                  filteredJobs.map(job => (
                    <div key={job.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr auto', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', gap: '16px', borderLeft: `4px solid ${getStatusColor(job.type)}` }}>
                      <div style={{ fontWeight: 600 }}>{job.date}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px' }}>{job.customerName}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{job.racketModel}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', color: 'var(--primary-color)' }}>{job.tension}</div>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{job.status.toUpperCase()}</div>
                      <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><MoreHorizontal size={20} /></button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* New Job View */}
        {view === 'new_job' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-panel" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px', fontWeight: 600 }}>
              <ArrowLeft size={20} /> Voltar ao Dashboard
            </button>
            <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>Registrar Novo Serviço</h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Cliente</label>
                <input type="text" placeholder="Buscar cliente por nome..." required style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Corda Main</label>
                  <input type="text" required value={mainString} onChange={(e) => setMainString(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Corda Cross</label>
                  <input type="text" required value={crossString} onChange={(e) => setCrossString(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tensão Main (lbs/kg)</label>
                  <input type="number" required value={tensionMain} onChange={(e) => setTensionMain(Number(e.target.value))} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tensão Cross (lbs/kg)</label>
                  <input type="number" required value={tensionCross} onChange={(e) => setTensionCross(Number(e.target.value))} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações</label>
                <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white', resize: 'none' }} />
              </div>

              <button type="submit" className="button-primary" style={{ padding: '16px', marginTop: '16px', fontSize: '16px' }}>
                {jobSaved ? <><CheckCircle size={20} /> Salvo com sucesso!</> : 'Salvar Encordoamento'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Customers View */}
        {view === 'customers' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-panel" style={{ padding: '32px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
                <h2 style={{ fontSize: '28px' }}>Base de Clientes</h2>
              </div>
              <button className="button-primary" style={{ padding: '8px 24px', fontSize: '14px' }}>
                <UserPlus size={18} /> Adicionar Cliente
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {MOCK_CUSTOMERS.map(customer => (
                <div key={customer.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-color)', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700 }}>{customer.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{customer.phone}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px' }}>Ver Histórico</button>
                    <button style={{ flex: 1, padding: '8px', background: 'var(--primary-color)', border: 'none', borderRadius: '8px', color: 'var(--text-dark)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Novo Serviço</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

