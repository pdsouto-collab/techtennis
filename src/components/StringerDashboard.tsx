import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, ArrowLeft, PackageOpen, Scissors, CheckCircle, UserPlus, X, Search, Copy, ArrowRightCircle, Trash2, Edit, ClipboardList, Grid, DollarSign, Truck, UserSquare, FolderPlus } from 'lucide-react';
import { OrderDetailsView } from './OrderDetailsView';
import { CustomerHistoryModal } from './CustomerHistoryModal';
import { AnalyticsView } from './AnalyticsView';
import { OrdersView } from './OrdersView';
import { SettingsView } from './SettingsView';
// Extended Mock Data for the new functionalities
const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Rafael Nadal', email: 'rafa@example.com', phone: '+1234567890' },
  { id: 'c2', name: 'Carlos Alcaraz', email: 'carlos@example.com', phone: '+0987654321' }
];

const INITIAL_JOBS = [
  { id: 'j3', customerName: 'Rafael Nadal', racketModel: 'Babolat Pure Aero', date: '2026-04-05', tension: '55/53 lbs', status: 'pronta', type: 'picking_up', paid: true, price: 120 },
  { id: 'j2', customerName: 'Carlos Alcaraz', racketModel: 'Babolat Pure Aero 98', date: '2026-04-06', tension: '50/50 lbs', status: 'aguardando', type: 'to_string' },
  { id: 'j1', customerName: 'Jannik Sinner', racketModel: 'Head Speed Pro', date: '2026-04-04', tension: '52/52 lbs', status: 'na_fila', type: 'to_string' },
];

export const StringerDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'dashboard' | 'new_job' | 'customers' | 'stringing' | 'order_details' | 'analytics' | 'orders' | 'settings'>('dashboard');
  const [activeOrderJob, setActiveOrderJob] = useState<any>(null);
  const [activeStringingJob, setActiveStringingJob] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'to_string' | 'picking_up'>('all');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isRacketModalOpen, setIsRacketModalOpen] = useState(false);
  const [isCloneRacketModalOpen, setIsCloneRacketModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activePaymentJob, setActivePaymentJob] = useState<any>(null);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentOrderCode, setCurrentOrderCode] = useState<string>('');

  const generateUniqueAlphanumericCode = (existingJobs: any[]) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    let isUnique = false;
    while (!isUnique) {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      isUnique = !existingJobs.some((j: any) => j.orderCode === code);
    }
    return code;
  };
  const [activePickupJob, setActivePickupJob] = useState<any>(null);
  const [racketFormDefault, setRacketFormDefault] = useState<{name?: string, isClone?: boolean} | null>(null);
  const [selectedJobRacket, setSelectedJobRacket] = useState('');
  const [newJobStep, setNewJobStep] = useState<1 | 2>(1);

  // Persistent States
  const [customers, setCustomers] = useState<{id: string, name: string, phone: string, email: string}[]>(() => {
    const saved = localStorage.getItem('tt_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [jobs, setJobs] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_jobs_v2');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [rackets, setRackets] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_rackets');
    return saved ? JSON.parse(saved) : [];
  });

  const [appSettings, setAppSettings] = useState<any>(() => {
    const saved = localStorage.getItem('tt_settings');
    const parsed = saved ? JSON.parse(saved) : { strings: ['Solinco Hyper-G Green 115', 'Babolat RPM Blast', 'Luxilon Alu Power'], pickupPoints: ['Test', 'Loja 1'], machines: ['Babolat Star 5', 'Wilson Baiardo'], stringers: ['Tester Ernesto', 'Paulo Souto'] };
    if (!parsed.sports) parsed.sports = ['Tênis', 'Beach Tennis', 'Squash', 'Badminton', 'Padel'];
    return parsed;
  });

  useEffect(() => { localStorage.setItem('tt_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('tt_jobs_v2', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('tt_rackets', JSON.stringify(rackets)); }, [rackets]);
  useEffect(() => { localStorage.setItem('tt_settings', JSON.stringify(appSettings)); }, [appSettings]);

  // Sync state if another tab changes localStorage
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'tt_jobs_v2' && e.newValue) {
        setJobs(JSON.parse(e.newValue));
      }
      if (e.key === 'tt_customers' && e.newValue) {
        setCustomers(JSON.parse(e.newValue));
      }
      if (e.key === 'tt_rackets' && e.newValue) {
        setRackets(JSON.parse(e.newValue));
      }
      if (e.key === 'tt_settings' && e.newValue) {
        setAppSettings(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Search State
  const [customerQuery, setCustomerQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerError, setCustomerError] = useState(false);
  
  // Form State
  const [jobSaved, setJobSaved] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [mainString, setMainString] = useState('');
  const [tensionMain, setTensionMain] = useState<number | ''>('');
  const [isHybrid, setIsHybrid] = useState(false);
  const [crossString, setCrossString] = useState('');
  const [tensionCross, setTensionCross] = useState<number | ''>('');
  const [isStringing, setIsStringing] = useState(true);
  const [preStretchMain, setPreStretchMain] = useState('');
  const [preStretchCross, setPreStretchCross] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [auxServices, setAuxServices] = useState<{type: string, isActive: boolean, price: number, notes: string}[]>([
    { type: 'Trocar grip base', isActive: false, price: 0, notes: '' },
    { type: 'Trocar overgrip', isActive: false, price: 0, notes: '' },
    { type: 'Serviço customizado', isActive: false, price: 0, notes: '' },
    { type: 'Compra de raquete nova', isActive: false, price: 0, notes: '' },
    { type: 'Outros serviços', isActive: false, price: 0, notes: '' }
  ]);

  const filteredJobs = activeFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.type === activeFilter);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = currentOrderCode || generateUniqueAlphanumericCode(jobs);
    if (!currentOrderCode) setCurrentOrderCode(newCode);

    const finalPrice = Number(price) + auxServices.filter(s => s.isActive).reduce((acc, s) => acc + s.price, 0);

    const newJob = {
      id: editingJobId ? editingJobId : Date.now().toString(),
      orderCode: newCode,
      customerName: selectedCustomer ? selectedCustomer.name : 'Desconhecido',
      racketModel: rackets.find(r => r.id === selectedJobRacket)?.name || 'Raquete Customizada',
      date: new Date().toLocaleDateString('pt-BR'),
      tension: isHybrid ? `${tensionMain}/${tensionCross} lbs` : `${tensionMain} lbs`,
      status: 'aguardando',
      type: 'to_string' as any,
      mainString,
      crossString,
      isHybrid,
      racketId: selectedJobRacket,
      isStringing,
      preStretchMain,
      preStretchCross,
      basePrice: Number(price),
      price: finalPrice,
      auxServices
    };
    
    if (editingJobId) {
      setJobs(prev => prev.map(j => j.id === editingJobId ? { ...j, ...newJob } : j));
    } else {
      setJobs(prev => [newJob, ...prev]);
    }

    setJobSaved(true);
    setTimeout(() => {
      setJobSaved(false);
      setView('dashboard');
      setNewJobStep(1);
      setCurrentOrderCode('');
      setEditingJobId(null);
      setSelectedCustomer(null);
      setCustomerQuery('');
      setSelectedJobRacket('');
      setMainString('');
      setCrossString('');
      setTensionMain('');
      setTensionCross('');
      setIsHybrid(false);
      setIsStringing(true);
      setPreStretchMain('');
      setPreStretchCross('');
      setPrice('');
      setAuxServices([
        { type: 'Trocar grip base', isActive: false, price: 0, notes: '' },
        { type: 'Trocar overgrip', isActive: false, price: 0, notes: '' },
        { type: 'Serviço customizado', isActive: false, price: 0, notes: '' },
        { type: 'Compra de raquete nova', isActive: false, price: 0, notes: '' },
        { type: 'Outros serviços', isActive: false, price: 0, notes: '' }
      ]);
    }, 1500);
  };

  const startEditingJob = (job: any, cust: any) => {
    setSelectedCustomer(cust);
    setCustomerQuery(cust?.name || '');
    setEditingJobId(job.id);
    setCurrentOrderCode(job.orderCode || job.id.substring(0,8).toUpperCase());
    
    const racketId = rackets.find(r => r.name === job.racketModel && r.customerId === cust?.id)?.id;
    if (racketId) setSelectedJobRacket(racketId);
    
    setMainString(job.mainString || '');
    setCrossString(job.crossString || '');
    setIsHybrid(job.isHybrid || false);
    setIsStringing(job.isStringing !== false);
    setPreStretchMain(job.preStretchMain || '');
    setPreStretchCross(job.preStretchCross || '');

    const match = job.tension?.match(/(\d+)(?:\/(\d+))?/);
    if (match) {
        setTensionMain(parseInt(match[1]) || '');
        if (match[2]) {
          setIsHybrid(true);
          setTensionCross(parseInt(match[2]));
        } else {
          setTensionCross(parseInt(match[1]) || '');
        }
    } else {
        setTensionMain('');
        setTensionCross('');
    }
    
    if (job.basePrice !== undefined) {
        setPrice(job.basePrice);
    } else if (job.price !== undefined) {
        setPrice(job.price);
    } else {
        setPrice('');
    }

    if (job.auxServices) {
        setAuxServices(job.auxServices);
    } else {
        setAuxServices([
          { type: 'Trocar grip base', isActive: false, price: 0, notes: '' },
          { type: 'Trocar overgrip', isActive: false, price: 0, notes: '' },
          { type: 'Serviço customizado', isActive: false, price: 0, notes: '' },
          { type: 'Compra de raquete nova', isActive: false, price: 0, notes: '' },
          { type: 'Outros serviços', isActive: false, price: 0, notes: '' }
        ]);
    }
    
    setView('new_job'); 
    setNewJobStep(2);
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
    <div style={{ paddingTop: '140px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
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
        <button onClick={() => { setView('dashboard'); setNewJobStep(1); setSelectedCustomer(null); setCustomerQuery(''); setSelectedJobRacket(''); setCurrentOrderCode(''); setEditingJobId(null); }} style={{
          background: 'none', border: 'none', padding: '12px 0', 
          color: view === 'dashboard' ? 'var(--primary-color)' : 'var(--text-secondary)',
          fontWeight: view === 'dashboard' ? 700 : 500, fontSize: '15px',
          borderBottom: view === 'dashboard' ? '2px solid var(--primary-color)' : '2px solid transparent',
          cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          Dashboard
        </button>
        <button onClick={() => { setView('analytics'); setNewJobStep(1); setSelectedCustomer(null); setCustomerQuery(''); setSelectedJobRacket(''); }} style={{
          background: 'none', border: 'none', padding: '12px 0', 
          color: view === 'analytics' ? 'var(--primary-color)' : 'var(--text-secondary)',
          fontWeight: view === 'analytics' ? 700 : 500, fontSize: '15px',
          borderBottom: view === 'analytics' ? '2px solid var(--primary-color)' : '2px solid transparent',
          cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          Analytics
        </button>
        <button onClick={() => { setView('orders'); setNewJobStep(1); setSelectedCustomer(null); setCustomerQuery(''); setSelectedJobRacket(''); }} style={{
          background: 'none', border: 'none', padding: '12px 0', 
          color: view === 'orders' ? 'var(--primary-color)' : 'var(--text-secondary)',
          fontWeight: view === 'orders' ? 700 : 500, fontSize: '15px',
          borderBottom: view === 'orders' ? '2px solid var(--primary-color)' : '2px solid transparent',
          cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          Ordens
        </button>
        <button onClick={() => { setView('settings'); setNewJobStep(1); setSelectedCustomer(null); setCustomerQuery(''); setSelectedJobRacket(''); }} style={{
          background: 'none', border: 'none', padding: '12px 0', 
          color: view === 'settings' ? 'var(--primary-color)' : 'var(--text-secondary)',
          fontWeight: view === 'settings' ? 700 : 500, fontSize: '15px',
          borderBottom: view === 'settings' ? '2px solid var(--primary-color)' : '2px solid transparent',
          cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          Configurações
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '1200px', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Gestão e Operação</h2>
              <button onClick={() => { setNewJobStep(1); setSelectedCustomer(null); setCustomerQuery(''); setSelectedJobRacket(''); setCurrentOrderCode(''); setEditingJobId(null); setView('new_job'); }} className="button-primary" style={{ padding: '8px 24px', fontSize: '14px' }}>
                <Plus size={18} /> Novo Encordoamento
              </button>
            </div>

            {/* Configurable Status Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" onClick={() => { setNewJobStep(1); setSelectedCustomer(null); setCustomerQuery(''); setSelectedJobRacket(''); setCurrentOrderCode(''); setEditingJobId(null); setView('new_job'); }}
                style={{ padding: '20px', cursor: 'pointer', borderLeft: `4px solid ${getStatusColor('dropping_off')}`, background: 'var(--bg-panel)' }}>
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
                    <div key={job.id} style={{ display: 'grid', gridTemplateColumns: (activeFilter === 'to_string' || activeFilter === 'picking_up') ? 'minmax(120px, 1fr) 2fr 1fr 1fr auto' : '1fr 2fr 1fr 1fr', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', gap: '16px', borderLeft: `4px solid ${getStatusColor(job.type)}` }}>
                      <div style={{ fontWeight: 600 }}>{job.date}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px' }}>{job.customerName}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{job.racketModel}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', color: 'var(--primary-color)' }}>{job.tension}</div>
                      </div>
                      
                      {activeFilter === 'to_string' ? (
                        <>
                          <div>
                             <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mains: Solinco Hyper-G</div>
                             <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cross: Solinco Hyper-G</div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setJobs(prev => prev.filter(j => j.id !== job.id))} style={{ background: '#E04A59', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Excluir">
                              <Trash2 size={16} />
                            </button>
                            <button onClick={() => {
                              const cust = customers.find(c => c.name === job.customerName);
                              startEditingJob(job, cust);
                            }} style={{ background: '#4298E7', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Editar Recebimento">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => { setActiveOrderJob(job); setView('order_details'); }} style={{ background: '#C25488', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ordem">
                              <ClipboardList size={16} />
                            </button>
                            <button onClick={() => { setActiveStringingJob(job); setView('stringing'); }} style={{ background: '#F2C94C', border: 'none', padding: '8px', borderRadius: '8px', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Encordoar">
                              <Grid size={16} />
                            </button>
                          </div>
                        </>
                      ) : activeFilter === 'picking_up' ? (
                        <>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 600, fontSize: '16px' }}>BRL {job.price ? job.price.toFixed(2) : '120.00'}</div>
                            <div style={{ fontSize: '12px', color: job.paid ? '#6FCF97' : '#E04A59', fontWeight: 600 }}>
                              {job.paid ? 'PAGO' : 'NÃO PAGO'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                              const cust = customers.find(c => c.name === job.customerName);
                              startEditingJob(job, cust);
                            }} style={{ background: '#4298E7', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Editar Recebimento">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => { setActiveOrderJob(job); setView('order_details'); }} style={{ background: '#C25488', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ordem">
                              <ClipboardList size={16} />
                            </button>
                            <button onClick={() => { setActivePaymentJob(job); setIsPaymentModalOpen(true); }} style={{ background: job.paid ? '#6FCF97' : '#E04A59', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Pagamento">
                              <DollarSign size={16} color={job.paid ? 'var(--text-dark)' : 'white'} />
                            </button>
                            <button onClick={() => { setActivePickupJob(job); setIsPickupModalOpen(true); }} style={{ background: '#1A202C', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Entregar e Finalizar">
                              <Truck size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{job.status.toUpperCase()}</div>
                      )}
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
                    <input type="datetime-local" min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Ponto de Encordoamento</label>
                    <select style={inputStyle}>
                      <option value="">Selecione...</option>
                      {appSettings.pickupPoints.map((p: string) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações (Notes)</label>
                  <textarea rows={4} style={{ ...inputStyle, resize: 'none' }}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' }}>
                  <button type="button" onClick={() => setView('dashboard')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '24px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
                    Fechar
                  </button>
                  <button type="submit" className="button-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                    Continuar
                  </button>
                </div>

              </form>
            ) : (
              <form id="newJobForm" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Racket Selection Row */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Raquete</label>
                    <select required style={inputStyle} value={selectedJobRacket} onChange={(e) => {
                          setSelectedJobRacket(e.target.value);
                          setMainString('');
                          setCrossString('');
                          setTensionMain('');
                          setTensionCross('');
                          setIsHybrid(false);
                          setIsStringing(true);
                          setPreStretchMain('');
                          setPreStretchCross('');
                        }}>
                      <option value="">Selecione a raquete do cliente...</option>
                      {(() => {
                         const customerRackets = rackets.filter(r => r.customerId === selectedCustomer?.id);
                         const counts: Record<string, number> = {};
                         const usedRacketIdsInOrder = jobs.filter(j => j.orderCode === currentOrderCode && j.id !== editingJobId).map(j => j.racketId);
                         return customerRackets.map(r => {
                             counts[r.name] = (counts[r.name] || 0) + 1;
                             const displayName = `${r.name} [${counts[r.name]}]`;
                             const isUsed = usedRacketIdsInOrder.includes(r.id);
                             return <option key={r.id} value={r.id} disabled={isUsed} style={{ color: isUsed ? '#888' : 'inherit' }}>{displayName} {isUsed ? '(Já na ordem)' : ''}</option>;
                         });
                      })()}
                    </select>
                  </div>
                  <button type="button" onClick={() => setIsCloneRacketModalOpen(true)} style={{ height: '50px', padding: '0 24px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
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
                      <select style={inputStyle} value={isStringing ? 'Sim' : 'Nao'} onChange={e => setIsStringing(e.target.value === 'Sim')}>
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

                    {auxServices.map((svc, idx) => (
                      <div key={svc.type}>
                         <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>{svc.type}</label>
                         <select value={svc.isActive ? "Sim" : "Não"} onChange={e => {
                               const newSvc = [...auxServices];
                               newSvc[idx].isActive = e.target.value === "Sim";
                               setAuxServices(newSvc);
                         }} style={inputStyle}>
                            <option value="Não">Não</option>
                            <option value="Sim">Sim</option>
                         </select>
                         {svc.isActive && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                               <div style={{ width: '130px', position: 'relative' }}>
                                 <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>BRL</span>
                                 <input type="number" placeholder="Valor" value={svc.price || ''} onChange={e => {
                                      const newSvc = [...auxServices];
                                      newSvc[idx].price = Number(e.target.value);
                                      setAuxServices(newSvc);
                                 }} style={{...inputStyle, paddingLeft: '56px'}} />
                               </div>
                               <div style={{ flex: 1 }}>
                                 <input type="text" placeholder="Observações" value={svc.notes} onChange={e => {
                                      const newSvc = [...auxServices];
                                      newSvc[idx].notes = e.target.value;
                                      setAuxServices(newSvc);
                                 }} style={inputStyle} />
                               </div>
                            </div>
                         )}
                      </div>
                    ))}
                  </div>

                  {/* Right Column / Main Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tipo de Encordoamento</label>
                        <select disabled={!isStringing} style={inputStyle}>
                          <option>Não definido</option>
                          <option>2 nós</option>
                          <option>4 nós</option>
                          <option>ATW</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Unidade de Tensão</label>
                        <select disabled={!isStringing} style={inputStyle}>
                          <option>Lbs</option>
                          <option>Kg</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Preço (BRL)</label>
                        <input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} style={inputStyle} />
                        {auxServices.some(s => s.isActive) && (
                          <div style={{ marginTop: '12px', fontSize: '14px', color: '#6FCF97', fontWeight: 700 }}>
                            Total com extras: BRL {(Number(price) + auxServices.filter(s => s.isActive).reduce((acc, s) => acc + s.price, 0)).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Corda Main</label>
                        <select disabled={!isStringing} required={isStringing} value={mainString} onChange={(e) => setMainString(e.target.value)} style={inputStyle}>
                          <option value="">Selecione...</option>
                          {appSettings.strings.map((s: string) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tensão Main (Kg/Lbs)</label>
                        <input disabled={!isStringing} type="number" placeholder="Tensão Main" required={isStringing} value={tensionMain} onChange={(e) => setTensionMain(e.target.value === '' ? '' : Number(e.target.value))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Pre-stretch Main (%)</label>
                        <input type="text" placeholder="Ex: 20%" disabled={!isStringing} value={preStretchMain} onChange={(e) => setPreStretchMain(e.target.value)} style={inputStyle} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isHybrid && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', overflow: 'hidden' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Corda Cross</label>
                            <select disabled={!isStringing} required={isStringing} value={crossString} onChange={(e) => setCrossString(e.target.value)} style={inputStyle}>
                              <option value="">Selecione...</option>
                              {appSettings.strings.map((s: string) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tensão Cross (Kg/Lbs)</label>
                            <input disabled={!isStringing} type="number" placeholder="Tensão Cross" required={isStringing} value={tensionCross} onChange={(e) => setTensionCross(e.target.value === '' ? '' : Number(e.target.value))} style={inputStyle} />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Pre-stretch Cross (%)</label>
                            <input disabled={!isStringing} type="text" placeholder="Ex: 20%" value={preStretchCross} onChange={(e) => setPreStretchCross(e.target.value)} style={inputStyle} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isHybrid ? (
                      <div onClick={() => setIsHybrid(false)} style={{ background: '#F9D0DA', padding: '16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', fontWeight: 600, color: '#D93B65', transition: 'background 0.2s' }}>
                        Cross igual às Mains
                      </div>
                    ) : (
                      <div onClick={() => setIsHybrid(true)} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)', transition: 'background 0.2s' }}>
                        Diferenciar cordas Cross (Híbrido)
                      </div>
                    )}

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
                  <button type="button" onClick={() => { setView('dashboard'); setNewJobStep(1); setCurrentOrderCode(''); }} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                    Fechar
                  </button>
                  <button type="button" onClick={() => {
                     const f = document.getElementById('newJobForm') as HTMLFormElement;
                     if (f && f.reportValidity()) {
                        const newCode = currentOrderCode || generateUniqueAlphanumericCode(jobs);
                        if (!currentOrderCode) setCurrentOrderCode(newCode);

                        const newJob = {
                          id: Date.now().toString(),
                          orderCode: newCode,
                          customerName: selectedCustomer ? selectedCustomer.name : 'Desconhecido',
                          racketModel: rackets.find(r => r.id === selectedJobRacket)?.name || 'Raquete Customizada',
                          date: new Date().toLocaleDateString('pt-BR'),
                          tension: `${tensionMain} lbs`,
                          status: 'aguardando',
                          type: 'to_string' as any
                        };
                        setJobs(prev => [newJob, ...prev]);
                        
                        setSelectedJobRacket('');
                        setMainString('');
                        setCrossString('');
                        setTensionMain(55);
                        setTensionCross(55);
                        setIsHybrid(false);
                        
                        // Pequeno pulso visual para feedback de que a primeira foi salva
                        setJobSaved(true);
                        setTimeout(() => setJobSaved(false), 1000);
                     }
                  }} style={{ padding: '16px 32px', background: '#D93B65', border: 'none', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
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
        {/* Stringing Execution View */}
        {view === 'stringing' && activeStringingJob && (
           <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-panel" style={{ width: '100%', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-heading)' }}>
                      Stringer Dashboard (V2)
                    </button>
                    <h2 style={{ fontSize: '24px', margin: 0, color: 'white' }}>{activeStringingJob.racketModel || 'Head Speed Pro'} <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal', fontSize: '16px' }}>18x20 L3</span></h2>
                 </div>
                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => setView('dashboard')} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Fechar</button>
                    <button onClick={() => { import('../utils/printUtils').then(m => m.printLabel(activeStringingJob, 'heart')); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Imprimir etiqueta (coração)</button>
                    <button onClick={() => { import('../utils/printUtils').then(m => m.printLabel(activeStringingJob, 'full')); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Imprimir etiqueta</button>
                    <button onClick={() => { 
                      const cust = customers.find((c: any) => c.name === activeStringingJob.customerName);
                      startEditingJob(activeStringingJob, cust); 
                    }} style={{ padding: '8px 16px', background: '#4298E7', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Editar Encordoamento</button>
                    <button onClick={() => {
                        setJobs(jobs.map(j => j.id === activeStringingJob.id ? { ...j, type: 'picking_up', status: 'pronta' } : j));
                        setView('dashboard');
                        setActiveFilter('picking_up');
                    }} style={{ padding: '8px 16px', background: '#6FCF97', border: 'none', borderRadius: '8px', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer' }}>Finalizar Encordoamento</button>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) 3fr', gap: '24px' }}>
                 {/* Left Column Data Blocks */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(111, 207, 151, 0.1)', border: '1px solid rgba(111, 207, 151, 0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                       <div style={{ fontSize: '13px', color: '#6FCF97', marginBottom: '4px' }}>Cliente</div>
                       <div style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>{activeStringingJob.customerName}</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                       <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Data de retirada</div>
                       <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>Sábado 4 Abril 2026 - 12:30</div>
                    </div>
                    <div style={{ background: 'rgba(155, 81, 224, 0.1)', border: '1px solid rgba(155, 81, 224, 0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                       <div style={{ fontSize: '13px', color: '#EBA6FF', marginBottom: '4px' }}>Tipo de Encordoamento</div>
                       <div style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>ATW</div>
                    </div>
                    <div style={{ background: 'rgba(66, 152, 231, 0.1)', border: '1px solid rgba(66, 152, 231, 0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                       <div style={{ fontSize: '13px', color: '#4298E7', marginBottom: '4px' }}>Mains</div>
                       <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>Solinco Hyper-G Green 115 @{activeStringingJob.tension}</div>
                    </div>
                    <div style={{ background: 'rgba(66, 152, 231, 0.1)', border: '1px solid rgba(66, 152, 231, 0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                       <div style={{ fontSize: '13px', color: '#4298E7', marginBottom: '4px' }}>Crosses</div>
                       <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>Solinco Hyper-G Green 115 @{activeStringingJob.tension}</div>
                    </div>
                 </div>

                 {/* Right Column Form & Dashboard */}
                 <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden' }}>
                    <div>
                       <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Notas do encordoamento</label>
                       <textarea rows={3} style={{ ...inputStyle, resize: 'none' }}></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                       <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Encordoador</label>
                          <select style={inputStyle}>
                             <option value="">Selecione...</option>
                             {appSettings.stringers.map((s: string) => <option key={s} value={s}>{s}</option>)}
                          </select>
                       </div>
                       <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Máquina</label>
                          <select style={inputStyle}>
                             <option value="">Selecione...</option>
                             {appSettings.machines.map((m: string) => <option key={m} value={m}>{m}</option>)}
                          </select>
                       </div>
                       <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Data do encordoamento</label>
                          <input type="text" defaultValue="04/04/2026 16:14" style={inputStyle} />
                       </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                       <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Frequência (HZ)</label>
                          <input type="number" placeholder="Frequency" style={inputStyle} />
                       </div>
                       <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Ert DT (DT)</label>
                          <input type="number" placeholder="Ert DT" style={inputStyle} />
                       </div>
                       <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Chromatic (CH)</label>
                          <input type="number" placeholder="Chromatic" style={inputStyle} />
                       </div>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                       <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'white' }}>Últimos encordoamentos da raquete</h3>
                       <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ minWidth: '800px', display: 'grid', gridTemplateColumns: '1.2fr 2fr 2fr 0.5fr 0.5fr 0.5fr 1fr 0.8fr 0.5fr', padding: '16px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                             <div>Data de ins.</div>
                             <div>Mains</div>
                             <div>Crosses</div>
                             <div>HZ</div>
                             <div>DT</div>
                             <div>CH</div>
                             <div>Encordoador</div>
                             <div>Preço</div>
                             <div>Horas</div>
                          </div>
                          
                          {[1, 2].map((i) => (
                             <div key={i} style={{ minWidth: '800px', display: 'grid', gridTemplateColumns: '1.2fr 2fr 2fr 0.5fr 0.5fr 0.5fr 1fr 0.8fr 0.5fr', padding: '16px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: 'white' }}>
                               <div>{i === 1 ? '04/04/2026 13:27' : '03/04/2026 19:37'}</div>
                               <div>
                                 <div style={{ fontWeight: 600 }}>Solinco Hyper-G Green 115</div>
                                 <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>@52lbs</div>
                               </div>
                               <div>
                                 <div style={{ fontWeight: 600 }}>Solinco Hyper-G Green 115</div>
                                 <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>@52lbs</div>
                               </div>
                               <div>-</div><div>-</div><div>-</div>
                               <div>Tester Ernesto</div>
                               <div style={{ fontWeight: 600 }}>BRL 120.00</div>
                               <div>0</div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}

        <OrderDetailsView 
           view={view} setView={setView} 
           activeOrderJob={activeOrderJob} 
           jobs={jobs} setJobs={setJobs} setActiveStringingJob={setActiveStringingJob}
           setActivePaymentJob={setActivePaymentJob} setIsPaymentModalOpen={setIsPaymentModalOpen}
           customers={customers} setSelectedCustomer={setSelectedCustomer} setNewJobStep={setNewJobStep}
           setActiveFilter={setActiveFilter} setIsCustomerModalOpen={setIsCustomerModalOpen}
           startEditingJob={startEditingJob} setCurrentOrderCode={setCurrentOrderCode} setEditingJobId={setEditingJobId}
        />

        {/* Customers View */}
        {view === 'customers' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-panel" style={{ padding: '32px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
                <h2 style={{ fontSize: '28px' }}>Base de Clientes</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button type="button" onClick={() => setView('dashboard')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '24px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  Fechar
                </button>
                <button className="button-primary" onClick={() => setIsCustomerModalOpen(true)} style={{ padding: '8px 24px', fontSize: '14px' }}>
                  <UserPlus size={18} /> Adicionar Cliente
                </button>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-dark)' }}>
                <thead>
                  <tr style={{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Name</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Stringing point</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Coach</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Club</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Email</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Phone</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Mobile</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer: any, index: number) => (
                    <tr key={customer.id} style={{ borderBottom: '1px solid #F3F4F6', background: index % 2 === 0 ? '#F8F9FA' : '#FFFFFF' }}>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600 }}>{customer.name}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>Test</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}></td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{customer.originClub || 'Não informado'}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{customer.email || ''}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}></td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{customer.phone || ''}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setSelectedCustomer(customer); setIsHistoryModalOpen(true); }} style={{ background: '#6136B3', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Histórico"><UserSquare size={16} /></button>
                          <button onClick={() => setCustomers(customers.filter(c => c.id !== customer.id))} style={{ background: '#D93B65', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Excluir"><Trash2 size={16} /></button>
                          <button onClick={() => { setSelectedCustomer(customer); setIsCustomerModalOpen(true); }} style={{ background: '#4298E7', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Editar"><Edit size={16} /></button>
                          <button onClick={() => { setSelectedCustomer(customer); setCustomerQuery(customer.name); setSelectedJobRacket(''); setNewJobStep(2); setView('new_job'); }} style={{ background: '#D93B65', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Nova Ordem"><FolderPlus size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination footer */}
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6B7280', fontSize: '13px', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Show</span>
                  <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #E5E7EB', background: '#F8F9FA' }}>
                    <option>10</option>
                  </select>
                  <span>entries</span>
                  <span style={{ marginLeft: '16px' }}>Showing 1 to {customers.length} of {customers.length} entries</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'not-allowed', fontWeight: 600 }}>Previous</button>
                  <button style={{ border: 'none', background: '#4298E7', color: 'white', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>1</button>
                  <button style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'not-allowed', fontWeight: 600 }}>Next</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'analytics' && <AnalyticsView jobs={filteredJobs} />}
        {view === 'orders' && <OrdersView 
          jobs={jobs} 
          customers={customers} 
          onAddOrder={() => { setView('new_job'); setNewJobStep(1); setSelectedCustomer(null); setCustomerQuery(''); setSelectedJobRacket(''); }} 
          onDeleteOrder={(orderCode: string) => setJobs(prev => prev.filter(j => (j.orderCode || j.id.substring(0,8).toUpperCase()) !== orderCode))}
          onEditOrder={(orderCode: string) => { 
            const job = jobs.find(j => (j.orderCode || j.id.substring(0,8).toUpperCase()) === orderCode);
            if (job) {
              const cust = customers.find(c => c.name === job.customerName);
              startEditingJob(job, cust);
            }
          }}
          onPayment={(orderCode: string) => {
            const job = jobs.find(j => (j.orderCode || j.id.substring(0,8).toUpperCase()) === orderCode);
            if (job) { setActivePaymentJob(job); setIsPaymentModalOpen(true); }
          }}
          onDelivery={(orderCode: string) => {
            const job = jobs.find(j => (j.orderCode || j.id.substring(0,8).toUpperCase()) === orderCode);
            if (job) { setActivePickupJob(job); setIsPickupModalOpen(true); }
          }}
        />}

        {view === 'settings' && <SettingsView settings={appSettings} setSettings={setAppSettings} />}

      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {isCustomerModalOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '24px'
          }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', background: 'var(--bg-panel)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              
              {/* Modal Header */}
              <div style={{ background: '#8F5FFF', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, margin: 0 }}>{selectedCustomer ? 'Editar Cliente' : 'Adicionar Cliente'}</h3>
                <button onClick={() => { setIsCustomerModalOpen(false); setSelectedCustomer(null); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => { 
                  e.preventDefault(); 
                  const fd = new FormData(e.currentTarget);
                  const firstName = fd.get('firstName') as string;
                  const lastName = fd.get('lastName') as string;
                  const customerData = {
                    name: `${firstName} ${lastName}`.trim(),
                    phone: fd.get('phone') as string,
                    email: fd.get('email') as string,
                    originClub: fd.get('originClub') as string
                  };
                  if (selectedCustomer) {
                    setCustomers(customers.map((c: any) => c.id === selectedCustomer.id ? { ...c, ...customerData } : c));
                  } else {
                    const newCustomer = { id: 'c' + Date.now(), ...customerData };
                    setCustomers(prev => [...prev, newCustomer]);
                    setSelectedCustomer(newCustomer);
                    setCustomerQuery(newCustomer.name);
                  }
                  setIsCustomerModalOpen(false); 
                }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Sobrenome</label>
                      <input name="lastName" type="text" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }} required defaultValue={selectedCustomer ? selectedCustomer.name?.split(' ').slice(1).join(' ') : ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Nome</label>
                      <input name="firstName" type="text" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }} required defaultValue={selectedCustomer ? selectedCustomer.name?.split(' ')[0] : ''} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Gênero</label>
                      <select name="gender" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }}>
                        <option value="">Selecione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="O">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Celular</label>
                      <input name="phone" type="tel" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }} required defaultValue={selectedCustomer ? selectedCustomer.phone : ''} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Clube de Origem</label>
                      <input name="originClub" type="text" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }} defaultValue={selectedCustomer?.originClub || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Professor / Treinador</label>
                      <input type="text" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>E-mail</label>
                      <input name="email" type="email" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }} defaultValue={selectedCustomer ? selectedCustomer.email : ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Data de Nascimento</label>
                      <input type="date" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }} />
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

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <CustomerHistoryModal 
            isOpen={isHistoryModalOpen} 
            onClose={() => setIsHistoryModalOpen(false)} 
            customer={selectedCustomer} 
            jobs={jobs} 
            setJobs={setJobs}
            onEdit={(job: any) => {
              setIsHistoryModalOpen(false);
              setCustomerQuery(job.customerName);
              setSelectedJobRacket(job.racketModel);
              setNewJobStep(2);
              setView('new_job');
            }}
          />
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
                      <select style={inputStyle} name="sport" defaultValue="Tênis">
                         {(appSettings.sports || ['Tênis', 'Beach Tennis', 'Squash', 'Badminton', 'Padel']).map((s: string) => <option key={s} value={s}>{s}</option>)}
                      </select>
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
                  
                  {rackets.filter(r => r.customerId === selectedCustomer?.id).length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Nenhuma raquete cadastrada na base para este cliente.
                    </div>
                  ) : (
                    rackets.filter(r => r.customerId === selectedCustomer?.id).map(racket => (
                      <div key={racket.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 3fr) 2fr 3fr 1fr', padding: '16px 24px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'white' }}>{racket.name}</div>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{new Date().toLocaleDateString('pt-BR')} 16:30</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>-</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => {
                            setRacketFormDefault({ name: racket.name + ' [Cópia]', isClone: true });
                            setIsCloneRacketModalOpen(false);
                            setIsRacketModalOpen(true);
                          }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Clonar raquete">
                            <Copy size={18} />
                          </button>
                          <button onClick={() => {
                            setSelectedJobRacket(racket.id);
                            setIsCloneRacketModalOpen(false);
                          }} style={{ background: '#4298E7', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Selecionar raquete">
                            <ArrowRightCircle size={18} />
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
          {isPaymentModalOpen && activePaymentJob && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ width: '90%', maxWidth: '800px', background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-panel)' }}>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>Preços</h2>
                  <button onClick={() => setIsPaymentModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                </div>
                <div style={{ padding: '32px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      <div>Item</div>
                      <div>Preço</div>
                      <div>Notas</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <div>Encordoamento</div>
                      <div>{activePaymentJob.price ? activePaymentJob.price.toFixed(2) : '120.00'} BRL</div>
                      <div>-</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', fontWeight: 600 }}>
                      <span style={{ marginRight: '16px', color: 'var(--text-secondary)' }}>Total</span>
                      <span>{activePaymentJob.price ? activePaymentJob.price.toFixed(2) : '120.00'} BRL</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', fontSize: '14px', fontWeight: 600, minHeight: '24px' }}>
                    {activePaymentJob.paid && (
                      <span>Pagamento recebido em: {new Date().toLocaleDateString('pt-BR')} 19:34</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    {activePaymentJob.paid ? (
                      <button onClick={() => {
                        setJobs(jobs.map(j => j.id === activePaymentJob.id ? { ...j, paid: false } : j));
                        setIsPaymentModalOpen(false);
                      }} style={{ padding: '12px 24px', background: '#E04A59', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                        Cancelar Pagamento
                      </button>
                    ) : (
                      <button onClick={() => {
                        setJobs(jobs.map(j => j.id === activePaymentJob.id ? { ...j, paid: true } : j));
                        setIsPaymentModalOpen(false);
                      }} style={{ padding: '12px 24px', background: '#6FCF97', border: 'none', borderRadius: '8px', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer' }}>
                        Confirmar Pagamento
                      </button>
                    )}
                    <button style={{ padding: '12px 24px', background: '#4298E7', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                      Editar Valores
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PICKUP CONFIRMATION MODAL */}
        <AnimatePresence>
          {isPickupModalOpen && activePickupJob && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ width: '90%', maxWidth: '600px', background: 'var(--bg-panel)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>Confirmação de Retirada</h2>
                  <button onClick={() => setIsPickupModalOpen(false)} style={{ background: 'white', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>X</button>
                </div>
                
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <button onClick={() => {
                    setJobs(prev => prev.map(j => j.id === activePickupJob.id ? { ...j, type: 'picked_up', paid: true } : j));
                    setIsPickupModalOpen(false);
                  }} style={{ background: '#F2C94C', border: 'none', borderRadius: '8px', padding: '24px', color: 'var(--text-dark)', fontWeight: 600, fontSize: '16px', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ marginBottom: '4px' }}>Raquete única</div>
                    <div>(Paga)</div>
                  </button>

                  <button onClick={() => {
                    setJobs(prev => prev.map(j => (j.customerName === activePickupJob.customerName && j.type === 'picking_up') ? { ...j, type: 'picked_up', paid: true } : j));
                    setIsPickupModalOpen(false);
                  }} style={{ background: '#D93B65', border: 'none', borderRadius: '8px', padding: '24px', color: 'white', fontWeight: 600, fontSize: '16px', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ marginBottom: '4px' }}>Ordem completa</div>
                    <div>(Paga)</div>
                  </button>

                  {!activePickupJob.paid && (
                    <>
                      <button onClick={() => {
                        setJobs(prev => prev.map(j => j.id === activePickupJob.id ? { ...j, type: 'picked_up' } : j));
                        setIsPickupModalOpen(false);
                      }} style={{ background: '#FFF9E6', border: 'none', borderRadius: '8px', padding: '24px', color: 'var(--text-dark)', fontWeight: 600, fontSize: '16px', cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ marginBottom: '4px' }}>Raquete única</div>
                        <div>(Não paga)</div>
                      </button>

                      <button onClick={() => {
                        setJobs(prev => prev.map(j => (j.customerName === activePickupJob.customerName && j.type === 'picking_up') ? { ...j, type: 'picked_up' } : j));
                        setIsPickupModalOpen(false);
                      }} style={{ background: '#FFF0F5', border: 'none', borderRadius: '8px', padding: '24px', color: '#D93B65', fontWeight: 600, fontSize: '16px', cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ marginBottom: '4px' }}>Ordem completa</div>
                        <div>(Não paga)</div>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
      </AnimatePresence>

    </div>
  );
};
