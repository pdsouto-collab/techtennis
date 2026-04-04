import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, ArrowLeft, MoreHorizontal, PackageOpen, Scissors, CheckCircle, UserPlus, X, Search, Copy, ArrowRightCircle } from 'lucide-react';

// Extended Mock Data for the new functionalities
const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Rafael Nadal', email: 'rafa@example.com', phone: '+1234567890' },
  { id: 'c2', name: 'Carlos Alcaraz', email: 'carlos@example.com', phone: '+0987654321' }
];

const INITIAL_JOBS = [
  { id: 'j3', customerName: 'Rafael Nadal', racketModel: 'Babolat Pure Aero', date: '2026-04-05', tension: '55/53 lbs', status: 'ready', type: 'picking_up' },
  { id: 'j2', customerName: 'Carlos Alcaraz', racketModel: 'Babolat Pure Aero 98', date: '2026-04-06', tension: '50/50 lbs', status: 'pending', type: 'to_string' },
  { id: 'j1', customerName: 'Jannik Sinner', racketModel: 'Head Speed Pro', date: '2026-04-04', tension: '52/52 lbs', status: 'received', type: 'dropping_off' },
];

export const StringerDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'dashboard' | 'new_job' | 'customers'>('dashboard');
  const [activeFilter, setActiveFilter] = useState<'all' | 'dropping_off' | 'to_string' | 'picking_up'>('all');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isRacketModalOpen, setIsRacketModalOpen] = useState(false);
  const [isCloneRacketModalOpen, setIsCloneRacketModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'racket' | 'all'>('racket');
  const [racketFormDefault, setRacketFormDefault] = useState<{name?: string, isClone?: boolean} | null>(null);
  const [newJobStep, setNewJobStep] = useState<1 | 2>(1);

  // Persistent States
  const [customers, setCustomers] = useState<{id: string, name: string, phone: string, email: string}[]>(() => {
    const saved = localStorage.getItem('tt_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [jobs, setJobs] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [rackets, setRackets] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_rackets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('tt_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('tt_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('tt_rackets', JSON.stringify(rackets)); }, [rackets]);

  // Search State
  const [customerQuery, setCustomerQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<{id: string, name: string} | null>(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerError, setCustomerError] = useState(false);
  
  // Form State
  const [jobSaved, setJobSaved] = useState(false);
  const [mainString, setMainString] = useState('');
  const [tensionMain, setTensionMain] = useState(55);

  const filteredJobs = activeFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.type === activeFilter);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob = {
      id: Date.now().toString(),
      customerName: selectedCustomer ? selectedCustomer.name : 'Desconhecido',
      racketModel: 'Raquete Customizada',
      date: new Date().toLocaleDateString('pt-BR'),
      tension: `${tensionMain} lbs`,
      status: 'recebido',
      type: 'dropping_off' as any
    };
    setJobs(prev => [newJob, ...prev]);

    setJobSaved(true);
    setTimeout(() => {
      setJobSaved(false);
      setView('dashboard');
      setNewJobStep(1);
      setSelectedCustomer(null);
      setCustomerQuery('');
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

  const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' };

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
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Para Encordoar: {jobs.filter(j => j.type === 'to_string').length}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Fila de trabalho</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" onClick={() => setActiveFilter('picking_up')}
                style={{ padding: '20px', cursor: 'pointer', borderLeft: `4px solid ${getStatusColor('picking_up')}`, background: activeFilter === 'picking_up' ? 'rgba(255,255,255,0.2)' : 'var(--bg-panel)' }}>
                <CheckCircle size={24} color={getStatusColor('picking_up')} style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Para Retirar: {jobs.filter(j => j.type === 'picking_up').length}</h3>
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

        {/* New Job Flow */}
        {view === 'new_job' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-panel" style={{ padding: '32px', width: '100%' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => newJobStep === 2 ? setNewJobStep(1) : setView('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '28px', margin: 0 }}>
                  {newJobStep === 1 ? 'Recebimento' : 'Detalhes do Encordoamento'}
                </h2>
              </div>
              {newJobStep === 2 && selectedCustomer && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600 }}>{selectedCustomer.name}</span>
                </div>
              )}
            </div>
            
            {newJobStep === 1 ? (
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                if (!selectedCustomer) {
                  setCustomerError(true);
                  return;
                }
                setCustomerError(false);
                setNewJobStep(2); 
              }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Cliente</label>
                    <input 
                      type="text" 
                      placeholder="Insira o nome do cliente" 
                      value={selectedCustomer ? selectedCustomer.name : customerQuery}
                      onChange={(e) => {
                        setCustomerQuery(e.target.value);
                        setSelectedCustomer(null);
                        setShowCustomerDropdown(true);
                        setCustomerError(false);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      required 
                      style={{ ...inputStyle, borderColor: customerError ? '#D93B65' : 'var(--border-light)' }} 
                    />
                    {customerError && (
                      <span style={{ color: '#D93B65', fontSize: '13px', marginTop: '6px', display: 'block' }}>
                        Por favor, selecione um cliente cadastrado da lista.
                      </span>
                    )}
                    
                    {/* Autocomplete Dropdown */}
                    <AnimatePresence>
                      {showCustomerDropdown && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-panel-solid)', zIndex: 10, borderRadius: '12px', marginTop: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                          
                          {customers.filter(c => c.name.toLowerCase().includes(customerQuery.toLowerCase())).map(customer => (
                            <div 
                              key={customer.id} 
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setCustomerQuery(customer.name);
                                setShowCustomerDropdown(false);
                              }}
                              style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', fontWeight: 500 }}
                            >
                              {customer.name}
                            </div>
                          ))}

                          {customers.filter(c => c.name.toLowerCase().includes(customerQuery.toLowerCase())).length === 0 && (
                            <div style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Nenhum cliente encontrado</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button type="button" onClick={() => setShowCustomerDropdown(true)} style={{ height: '50px', padding: '0 24px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, marginTop: '29px' }}>
                    <Search size={18} /> Buscar Cliente
                  </button>
                  <button type="button" onClick={() => setIsCustomerModalOpen(true)} className="button-primary" style={{ height: '50px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '29px' }}>
                    <Plus size={18} /> Novo Cliente
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Previsão de Entrega (Order pick up)</label>
                    <input type="datetime-local" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Ponto de Encordoamento</label>
                    <select style={inputStyle}>
                      <option value="test">Test</option>
                      <option value="loja1">Loja 1</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações (Notes)</label>
                  <textarea rows={4} style={{ ...inputStyle, resize: 'none' }}></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="submit" className="button-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                    Continuar
                  </button>
                </div>

              </form>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Racket Selection Row */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Raquete</label>
                    <select required style={inputStyle}>
                      <option value="">Selecione a raquete do cliente...</option>
                      {rackets.filter(r => !r.customerId || r.customerId === selectedCustomer?.id).map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="button" style={{ height: '50px', padding: '0 24px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    <Search size={18} /> Buscar Raquete
                  </button>
                  <button type="button" onClick={() => { setRacketFormDefault(null); setIsRacketModalOpen(true); }} className="button-primary" style={{ height: '50px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Nova Raquete
                  </button>
                  <button type="button" onClick={() => setIsCloneRacketModalOpen(true)} style={{ height: '50px', padding: '0 24px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    <Copy size={18} /> Clonar Raquete
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '32px' }}>
                  
                  {/* Left Column Configs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Encordoamento</label>
                      <select style={inputStyle} defaultValue="Sim">
                        <option value="Sim">Sim</option>
                        <option value="Nao">Não</option>
                      </select>
                    </div>

                    <div onClick={() => setIsHistoryModalOpen(true)} style={{ padding: '16px', background: 'var(--primary-color)', borderRadius: '12px', color: 'var(--text-dark)', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.1s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                      <Search size={18} /> Histórico Recente
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                      <span>Usa rolo próprio</span>
                      <input type="checkbox" style={{ accentColor: '#D93B65', width: '20px', height: '20px' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                      <span>Usa set próprio</span>
                      <input type="checkbox" style={{ accentColor: '#D93B65', width: '20px', height: '20px' }} />
                    </div>

                    <div><label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Trocar grip base</label><select style={inputStyle}><option>Não</option><option>Sim</option></select></div>
                    <div><label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Trocar overgrip</label><select style={inputStyle}><option>Não</option><option>Sim</option></select></div>
                    <div><label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Serviço customizado</label><select style={inputStyle}><option>Não</option><option>Sim</option></select></div>
                    <div><label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Compra de raquete nova</label><select style={inputStyle}><option>Não</option><option>Sim</option></select></div>
                    <div><label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Outros serviços</label><select style={inputStyle}><option>Não</option><option>Sim</option></select></div>
                  </div>

                  {/* Right Column / Main Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tipo de Encordoamento</label>
                        <select style={inputStyle}>
                          <option>Não definido</option>
                          <option>2 nós</option>
                          <option>4 nós</option>
                          <option>ATW</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Unidade de Tensão</label>
                        <select style={inputStyle}>
                          <option>Lbs</option>
                          <option>Kg</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Preço (BRL)</label>
                        <input type="number" placeholder="0.00" style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Corda Main</label>
                        <input type="text" placeholder="Mains" required value={mainString} onChange={(e) => setMainString(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tensão Main</label>
                        <input type="number" placeholder="Lbs/Kg" required value={tensionMain} onChange={(e) => setTensionMain(Number(e.target.value))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Pre-stretch Main (%)</label>
                        <select style={inputStyle}><option value=""></option><option value="5">5%</option><option value="10">10%</option><option value="20">20%</option></select>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Diferenciar cordas Cross (Híbrido)
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Logo</label>
                        <select style={inputStyle}><option>Não</option><option>Sim</option></select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Notas do Logo</label>
                        <textarea rows={2} style={{ ...inputStyle, resize: 'none' }}></textarea>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Notas sobre a raquete</label>
                        <textarea rows={2} style={{ ...inputStyle, resize: 'none' }}></textarea>
                      </div>
                    </div>
                  </div>

                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button type="button" onClick={() => { setView('dashboard'); setNewJobStep(1); }} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                    Fechar
                  </button>
                  <button type="button" style={{ padding: '16px 32px', background: '#D93B65', border: 'none', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                    Adicionar outra raquete
                  </button>
                  <button type="submit" className="button-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                    {jobSaved ? <><CheckCircle size={20} /> Salvo!</> : 'Finalizar Pedido'}
                  </button>
                </div>
              </form>
            )}
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
              <button className="button-primary" onClick={() => setIsCustomerModalOpen(true)} style={{ padding: '8px 24px', fontSize: '14px' }}>
                <UserPlus size={18} /> Adicionar Cliente
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {customers.map(customer => (
                <div key={customer.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-color)', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700 }}>{customer.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{customer.phone || 'Sem celular'}</p>
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

      {/* Add Customer Modal */}
      <AnimatePresence>
        {isCustomerModalOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,12,60,0.8)', backdropFilter: 'blur(8px)',
            zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '24px'
          }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', background: 'var(--bg-panel-solid)', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              
              {/* Modal Header */}
              <div style={{ background: '#7B61FF', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 600, margin: 0 }}>Adicionar Cliente</h3>
                <button onClick={() => setIsCustomerModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '32px', overflowY: 'auto', flex: 1, background: 'rgba(255,255,255,0.05)' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => { 
                  e.preventDefault(); 
                  const fd = new FormData(e.currentTarget);
                  const firstName = fd.get('firstName') as string;
                  const lastName = fd.get('lastName') as string;
                  const newCustomer = {
                    id: 'c' + Date.now(),
                    name: `${firstName} ${lastName}`.trim(),
                    phone: fd.get('phone') as string,
                    email: fd.get('email') as string
                  };
                  setCustomers(prev => [...prev, newCustomer]);
                  // Set naturally as selected customer if coming from creation flow
                  setSelectedCustomer(newCustomer);
                  setCustomerQuery(newCustomer.name);
                  setIsCustomerModalOpen(false); 
                }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Sobrenome</label>
                      <input name="lastName" type="text" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Nome</label>
                      <input name="firstName" type="text" style={inputStyle} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Gênero</label>
                      <select name="gender" style={inputStyle}>
                        <option value="">Selecione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="O">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Celular</label>
                      <input name="phone" type="tel" style={inputStyle} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Clube de Origem</label>
                      <input type="text" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Professor / Treinador</label>
                      <input type="text" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>E-mail</label>
                      <input name="email" type="email" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Data de Nascimento</label>
                      <input type="date" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>CPF / CNPJ</label>
                      <input type="text" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Telefone Fixo</label>
                      <input type="tel" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Endereço</label>
                      <input type="text" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>CEP</label>
                      <input type="text" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Cidade</label>
                      <input type="text" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>País</label>
                      <input type="text" defaultValue="Brasil" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Ponto de Encordoamento</label>
                      <select style={inputStyle}>
                        <option value="Test">Test</option>
                        <option value="Loja 1">Loja 1</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Código da Racketpedia</label>
                      <input type="text" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', cursor: 'pointer', fontSize: '15px' }}>
                      <input type="radio" name="customerType" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)' }} />
                      Cliente Pessoa Física
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', cursor: 'pointer', fontSize: '15px' }}>
                      <input type="radio" name="customerType" style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)' }} />
                      Cliente Pessoa Jurídica
                    </label>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações</label>
                    <textarea rows={3} style={{ ...inputStyle, resize: 'none' }}></textarea>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
                    <button type="button" onClick={() => setIsCustomerModalOpen(false)} style={{ padding: '16px 32px', background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Cancelar</button>
                    <button type="submit" className="button-primary" style={{ padding: '16px 32px' }}>Salvar Cliente</button>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Racket Modal */}
      <AnimatePresence>
        {isRacketModalOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,12,60,0.8)', backdropFilter: 'blur(8px)',
            zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '24px'
          }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', background: 'var(--bg-panel-solid)', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              
              {/* Modal Header */}
              <div style={{ background: '#3A52EE', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 600, margin: 0 }}>{racketFormDefault?.isClone ? 'Clonar Raquete' : 'Adicionar Raquete'}</h3>
                <button onClick={() => setIsRacketModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '32px', overflowY: 'auto', flex: 1, background: 'rgba(255,255,255,0.05)' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => { 
                  e.preventDefault(); 
                  const fd = new FormData(e.currentTarget);
                  const newRacket = {
                    id: 'r' + Date.now(),
                    name: fd.get('racketName') as string,
                    customerId: selectedCustomer?.id || ''
                  };
                  setRackets(prev => [...prev, newRacket]);
                  setIsRacketModalOpen(false); 
                }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Raquete</label>
                      <input name="racketName" type="text" placeholder="Nome da Raquete" required style={inputStyle} defaultValue={racketFormDefault?.name || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Identificador</label>
                      <input type="text" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Padrão de cordas</label>
                      <input type="text" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tamanho do Grip</label>
                      <input type="text" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Esporte</label>
                      <select style={inputStyle} defaultValue="Tênis"><option>Tênis</option><option>Beach Tennis</option></select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações</label>
                    <textarea rows={3} style={{ ...inputStyle, resize: 'none' }}></textarea>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Peso (g)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Equilíbrio (mm)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Comprimento (mm)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Swingweight (kgcm²)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Spinweight (kgcm²)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Twistweight (kgcm²)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Recoilweight (kgcm²)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Índice Polar</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez (RA)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez Dinâmica (Hz)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez Dinâmica (DRA)</label>
                      <input type="number" step="0.1" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                    <button type="button" onClick={() => setIsRacketModalOpen(false)} style={{ padding: '16px 32px', background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Fechar</button>
                    <button type="submit" className="button-primary" style={{ padding: '16px 32px' }}>Salvar Alterações</button>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clone Racket Modal (Customer Rackets) */}
      <AnimatePresence>
        {isCloneRacketModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,12,60,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', background: 'var(--bg-panel-solid)', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              
              <div style={{ background: '#3A52EE', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 600, margin: 0 }}>Raquetes do Cliente</h3>
                <button onClick={() => setIsCloneRacketModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
              </div>

              <div style={{ padding: '32px', overflowY: 'auto', flex: 1, background: 'rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <button className="button-primary" onClick={() => { setIsCloneRacketModalOpen(false); setRacketFormDefault(null); setIsRacketModalOpen(true); }} style={{ padding: '12px 24px', fontSize: '14px' }}>
                    <Plus size={16} /> Adicionar nova raquete
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Buscar:</span>
                    <input type="text" placeholder="Nome da raquete..." style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                  </div>
                </div>

                {/* Table */}
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 3fr) 2fr 3fr 1fr', padding: '16px 24px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
                    <div>Raquete</div>
                    <div>Último Encordoamento</div>
                    <div>Notas</div>
                    <div></div>
                  </div>
                  
                  {rackets.filter(r => !r.customerId || r.customerId === selectedCustomer?.id).length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Nenhuma raquete cadastrada na base para este cliente.
                    </div>
                  ) : (
                    rackets.filter(r => !r.customerId || r.customerId === selectedCustomer?.id).map(racket => (
                      <div key={racket.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 3fr) 2fr 3fr 1fr', padding: '16px 24px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'white' }}>{racket.name}</div>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{new Date().toLocaleDateString('pt-BR')} 16:30</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>-</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button onClick={() => {
                            setRacketFormDefault({ name: racket.name + ' [Cópia]', isClone: true });
                            setIsCloneRacketModalOpen(false);
                            setIsRacketModalOpen(true);
                          }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Clonar raquete">
                            <Copy size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                  <button onClick={() => setIsCloneRacketModalOpen(false)} style={{ padding: '12px 32px', background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,12,60,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '1200px', maxHeight: '90vh', background: 'var(--bg-panel-solid)', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              
              {/* Header Tabs Block */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingRight: '24px', background: 'rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => setHistoryTab('racket')} style={{ padding: '16px 32px', background: historyTab === 'racket' ? '#4298E7' : 'transparent', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '15px', borderBottom: historyTab === 'racket' ? '3px solid white' : '3px solid transparent', transition: 'all 0.2s' }}>Racket stringings</button>
                  <button onClick={() => setHistoryTab('all')} style={{ padding: '16px 32px', background: historyTab === 'all' ? '#7B61FF' : 'transparent', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '15px', borderBottom: historyTab === 'all' ? '3px solid white' : '3px solid transparent', transition: 'all 0.2s' }}>All customer stringings</button>
                </div>
                <button onClick={() => setIsHistoryModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
              </div>

              <div style={{ padding: '32px', overflowY: 'auto', flex: 1, background: 'rgba(255,255,255,0.05)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Search:</span>
                    <input type="text" style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ minWidth: '1000px', display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(200px, 2fr) 2fr 2fr 0.5fr 0.5fr 0.5fr 1.5fr minmax(120px, 1fr) 1fr 1fr 0.5fr', padding: '16px 20px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div>Insertion date</div>
                    <div>Racket</div>
                    <div>Mains</div>
                    <div>Crosses</div>
                    <div>HZ</div>
                    <div>DT</div>
                    <div>CH</div>
                    <div>Stringer</div>
                    <div>Stringing date</div>
                    <div>Price</div>
                    <div>Played hours</div>
                    <div></div>
                  </div>
                  
                  {jobs.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum histórico encontrado.</div>
                  ) : (
                    jobs.map(job => (
                      <div key={job.id} style={{ minWidth: '1000px', display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(200px, 2fr) 2fr 2fr 0.5fr 0.5fr 0.5fr 1.5fr minmax(120px, 1fr) 1fr 1fr 0.5fr', padding: '16px 20px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: 'white' }}>
                        <div>03/04/2026 19:37</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{job.racketModel || 'Head Speed Pro 2022 [1]'}</div>
                          <div style={{ fontWeight: 400, color: 'var(--text-secondary)', marginTop: '4px' }}>18x20 L3</div>
                        </div>
                        <div>
                          <span style={{ fontWeight: 600 }}>Solinco Hyper-G Green 115</span><br/>
                          <span style={{ color: 'var(--text-secondary)' }}>@{job.tension || '52lbs'}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: 600 }}>Solinco Hyper-G Green 115</span><br/>
                          <span style={{ color: 'var(--text-secondary)' }}>@{job.tension || '52lbs'}</span>
                        </div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div style={{ color: 'var(--text-secondary)' }}>Tester Ernesto</div>
                        <div>
                          <span style={{ fontWeight: 600 }}>03/04/2026</span><br/>
                          <span style={{ color: 'var(--text-secondary)' }}>16:37</span>
                        </div>
                        <div style={{ fontWeight: 600 }}>BRL 140.00</div>
                        <div style={{ color: 'var(--text-secondary)' }}>0</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button onClick={() => {
                            setIsHistoryModalOpen(false);
                          }} style={{ background: '#4298E7', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Importar">
                            <ArrowRightCircle size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

