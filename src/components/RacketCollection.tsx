import { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar as CalendarIcon, Package, Plus, Edit, Trash2, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const RacketCollection = () => {
  const navigate = useNavigate();
  
  // Local Storage Data
  const [jobs] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_jobs_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [professors] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_professors');
    return saved ? JSON.parse(saved) : [];
  });
  const [appSettings] = useState<any>(() => {
    const saved = localStorage.getItem('tt_settings');
    return saved ? JSON.parse(saved) : {};
  });

  // State
  const location = useLocation();
  const role = location.state?.role || 'ENCORDOADOR';
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>(() => {
    // If it's a professor, automatically select the first one as a mock logged-in user
    if (role === 'PROFESSOR') {
      const saved = localStorage.getItem('tt_professors');
      const profs = saved ? JSON.parse(saved) : [];
      return profs.length > 0 ? profs[0].id : '';
    }
    return '';
  });

  const [manualEntries, setManualEntries] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_manual_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [manualAmount, setManualAmount] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualCustomer, setManualCustomer] = useState('');
  const [manualReason, setManualReason] = useState('');

  const handleSaveManualEntry = () => {
    if (!manualAmount || !selectedProfessorId || selectedProfessorId === 'all') {
      alert('Selecione um professor específico e informe o valor.');
      return;
    }
    const newEntry = {
      id: editingEntry ? editingEntry.id : 'me_' + Date.now().toString(),
      professorId: selectedProfessorId,
      amount: parseFloat(manualAmount),
      date: manualDate,
      customerName: manualCustomer,
      reason: manualReason
    };
    let updated;
    if (editingEntry) {
      updated = manualEntries.map(e => e.id === editingEntry.id ? newEntry : e);
    } else {
      updated = [...manualEntries, newEntry];
    }
    setManualEntries(updated);
    localStorage.setItem('tt_manual_entries', JSON.stringify(updated));
    setIsManualModalOpen(false);
  };

  const handleDeleteManualEntry = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
      const updated = manualEntries.filter(e => e.id !== id);
      setManualEntries(updated);
      localStorage.setItem('tt_manual_entries', JSON.stringify(updated));
    }
  };

  const openManualModal = (entry?: any) => {
    if (entry) {
      setEditingEntry(entry);
      setManualAmount(entry.amount.toString());
      setManualDate(entry.date || '');
      setManualCustomer(entry.customerName || '');
      setManualReason(entry.reason || '');
    } else {
      setEditingEntry(null);
      setManualAmount('');
      setManualDate('');
      setManualCustomer('');
      setManualReason('');
    }
    setIsManualModalOpen(true);
  };
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [filterMonth, setFilterMonth] = useState<string>(currentMonth.toString().padStart(2, '0'));
  const [filterYear, setFilterYear] = useState<string>(currentYear.toString());

  // Helper
  const calculateCommission = (job: any) => {
    if (!job.paid) return 0;
    
    let total = 0;
    const commissions = appSettings.commissions || [];

    // Calculate stringing component (using 'Encordoamento' as default keyword)
    if (job.basePrice > 0) {
      const stringComm = commissions.find((c: any) => c.name.toLowerCase().includes('encordoamento'));
      if (stringComm) {
        total += job.basePrice * (stringComm.percent / 100);
      }
    }

    // Calculate auxiliary services
    if (job.auxServices) {
      job.auxServices.forEach((service: any) => {
        if (service.isActive && service.price > 0) {
          const svcComm = commissions.find((c: any) => c.name.toLowerCase() === service.type.toLowerCase());
          if (svcComm) {
            total += service.price * (svcComm.percent / 100);
          }
        }
      });
    }

    return total;
  };

  const filteredJobs = jobs.filter(job => {
    if (!job.commissionedProfessorId || job.commissionedProfessorId === 'none') return false;
    if (selectedProfessorId !== 'all' && job.commissionedProfessorId !== selectedProfessorId) return false;
    
    // Date Filtering based on job.date (assuming it's a parseable standard format, e.g. YYYY-MM-DD or DD/MM/YYYY)
    // In StringerDashboard it is `new Date().toLocaleDateString('pt-BR')` which is DD/MM/YYYY
    let jobMonth = '';
    let jobYear = '';
    if (job.date && job.date.includes('/')) {
      const parts = job.date.split('/');
      jobMonth = parts[1];
      jobYear = parts[2];
    } else if (job.date) {
      const dateObj = new Date(job.date);
      jobMonth = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      jobYear = dateObj.getFullYear().toString();
    }
    
    if (filterMonth && jobMonth !== filterMonth) return false;
    if (filterYear && jobYear !== filterYear) return false;

    return true;
  });

  const filteredManualEntries = manualEntries.filter(entry => {
    if (selectedProfessorId !== 'all' && entry.professorId !== selectedProfessorId) return false;
    
    let entryMonth = '';
    let entryYear = '';
    if (entry.date) {
      const parts = entry.date.split('-');
      if (parts.length >= 3) {
         entryMonth = parts[1];
         entryYear = parts[0];
      }
    }
    
    if (entry.date) {
       if (filterMonth && entryMonth !== filterMonth) return false;
       if (filterYear && entryYear !== filterYear) return false;
    }
    return true;
  });

  const unifiedList = [
    ...filteredJobs.map(job => {
      const commission = calculateCommission(job);
      return {
        id: job.id,
        isManual: false,
        displayDate: job.date || 'S/ Data',
        customerName: job.customerName || 'N/A',
        description: job.racketModel || 'Raquetes/Serviços',
        orderCode: job.orderCode || job.id.substring(0,8).toUpperCase(),
        paid: job.paid,
        credit: commission,
        pickupDate: job.pickupDate,
        professorId: job.commissionedProfessorId,
        originalData: job
      };
    }),
    ...filteredManualEntries.map(entry => {
      let displayDate = 'S/ Data';
      if (entry.date) {
        const parts = entry.date.split('-');
        if(parts.length===3) displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return {
        id: entry.id,
        isManual: true,
        displayDate,
        customerName: entry.customerName || '-',
        description: entry.reason || 'Lançamento Manual',
        orderCode: 'MANUAL',
        paid: true,
        credit: entry.amount,
        pickupDate: null,
        professorId: entry.professorId,
        originalData: entry
      };
    })
  ].sort((a, b) => b.id.localeCompare(a.id));

  const totalCredit = unifiedList.reduce((acc, item) => acc + (item.paid ? item.credit : 0), 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '160px 5% 60px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 600 }}>
            <ArrowLeft size={20} /> Voltar ao Início
          </button>
          <h1 style={{ fontSize: '32px', color: 'white', fontFamily: 'var(--font-heading)', margin: 0 }}>Extrato de Coleta</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Relatório de comissionamento de raquetes</p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {role !== 'PROFESSOR' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Selecione o Professor</label>
              <select 
                value={selectedProfessorId} 
                onChange={(e) => setSelectedProfessorId(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', minWidth: '200px' }}
              >
                <option value="">Selecione...</option>
                <option value="all">Todos os Professores</option>
                {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Competência (Mês / Ano)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(e.target.value)}
                style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={(i + 1).toString().padStart(2, '0')}>{(i + 1).toString().padStart(2, '0')}</option>
                ))}
              </select>
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)}
                style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                  <option key={y} value={y.toString()}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedProfessorId ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', margin: 0 }}>Resultados do Período</h2>
            {selectedProfessorId && selectedProfessorId !== 'all' && role !== 'PROFESSOR' && (
              <button 
                onClick={() => openManualModal()}
                style={{ background: 'var(--primary-color)', color: '#1a1a2e', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Plus size={18} /> Adicionar Lançamento Manual
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div style={{ padding: '24px', background: 'var(--bg-panel-solid)', borderRadius: '16px', borderLeft: '4px solid #4298E7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Total de Raquetes (Mês)</span>
                <Package size={20} color="#4298E7" />
              </div>
              <span style={{ color: 'white', fontSize: '32px', fontWeight: 800 }}>{filteredJobs.length}</span>
            </div>
            
            <div style={{ padding: '24px', background: 'var(--bg-panel-solid)', borderRadius: '16px', borderLeft: '4px solid #6FCF97' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Crédito Gerado (Mês)</span>
                <DollarSign size={20} color="#6FCF97" />
              </div>
              <span style={{ color: '#6FCF97', fontSize: '32px', fontWeight: 800 }}>R$ {totalCredit.toFixed(2)}</span>
            </div>
          </div>

          {/* List/Table */}
          <div style={{ background: 'var(--bg-panel-solid)', borderRadius: '12px', overflow: 'hidden' }}>
            {unifiedList.length === 0 ? (
              <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Nenhuma raquete encontrada para este filtro.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'white' }}>
                <thead>
                  <tr style={{ color: 'var(--text-secondary)', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '16px 24px', fontWeight: 600 }}>Entrada</th>
                    <th style={{ padding: '16px 24px', fontWeight: 600 }}>Cliente / Raquete</th>
                    <th style={{ padding: '16px 24px', fontWeight: 600 }}>Previsão de Retirada</th>
                    <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status do Pedido</th>
                    <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Crédito</th>
                  </tr>
                </thead>
                <tbody>
                  {unifiedList.map((item) => {
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: item.isManual ? 'rgba(66, 152, 231, 0.05)' : 'transparent' }}>
                        <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <CalendarIcon size={14} color="var(--primary-color)" /> {item.displayDate}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Ordem: <span style={{ fontWeight: 600 }}>{item.orderCode}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 600, fontSize: '15px' }}>{item.customerName}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.description}</div>
                          {item.isManual && (
                             <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>AJUSTE MANUAL</span>
                          )}
                          {!item.isManual && selectedProfessorId === 'all' && (
                            <div style={{ fontSize: '12px', color: '#E28743', marginTop: '4px', fontWeight: 600 }}>Prof: {professors.find(p => p.id === item.professorId)?.name || 'Desconhecido'}</div>
                          )}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                           {item.pickupDate ? new Date(item.pickupDate).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                           <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '100px', fontWeight: 600, background: item.paid ? 'rgba(111,207,151,0.1)' : 'rgba(235,87,87,0.1)', color: item.paid ? '#6FCF97' : '#EB5757' }}>
                             {item.paid ? 'PAGO' : 'AGUARDA PGTO'}
                           </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: item.paid ? '#6FCF97' : 'var(--text-secondary)' }}>
                           {item.credit < 0 ? `- R$ ${Math.abs(item.credit).toFixed(2)}` : `R$ ${item.credit.toFixed(2)}`}
                           {item.isManual && role !== 'PROFESSOR' && (
                             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                               <button onClick={() => openManualModal(item.originalData)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4298E7' }}><Edit size={16} /></button>
                               <button onClick={() => handleDeleteManualEntry(item.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EB5757' }}><Trash2 size={16} /></button>
                             </div>
                           )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          
        </motion.div>
      ) : (
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Por favor, selecione um professor no painel acima para carregar o extrato de coleta.
        </div>
      )}

      {isManualModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '32px', borderRadius: '24px', position: 'relative' }}>
            <button onClick={() => setIsManualModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ color: 'white', marginTop: 0, marginBottom: '24px', fontSize: '24px' }}>{editingEntry ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div>
                  <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Valor (R$)* (Use negativo para deduzir)</label>
                  <input type="number" step="0.01" value={manualAmount} onChange={e => setManualAmount(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }} placeholder="Ex: 50.00 ou -20.00" />
               </div>
               <div>
                  <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Data (Opcional)</label>
                  <input type="date" value={manualDate} onChange={e => setManualDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }} />
               </div>
               <div>
                  <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Cliente / Referência (Opcional)</label>
                  <input type="text" value={manualCustomer} onChange={e => setManualCustomer(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }} placeholder="Ex: João Silva" />
               </div>
               <div>
                  <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Motivo / Texto (Opcional)</label>
                  <textarea value={manualReason} onChange={e => setManualReason(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', resize: 'vertical' }} placeholder="Ex: Ajuste de comissão da aula X" />
               </div>
            </div>

            <button onClick={handleSaveManualEntry} className="button-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '24px', fontSize: '16px' }}>Salvar Lançamento</button>
          </div>
        </div>
      )}

    </div>
  );
};
