import { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar as CalendarIcon, Package } from 'lucide-react';
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

  const totalCredit = filteredJobs.reduce((acc, job) => acc + calculateCommission(job), 0);

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
          
          {/* Summary Row */}
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
            {filteredJobs.length === 0 ? (
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
                  {filteredJobs.map((job) => {
                    const commission = calculateCommission(job);
                    return (
                      <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <CalendarIcon size={14} color="var(--primary-color)" /> {job.date}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Ordem: <span style={{ fontWeight: 600 }}>{job.orderCode || job.id.substring(0,8).toUpperCase()}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 600, fontSize: '15px' }}>{job.customerName}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{job.racketModel}</div>
                          {selectedProfessorId === 'all' && (
                            <div style={{ fontSize: '12px', color: '#E28743', marginTop: '4px', fontWeight: 600 }}>Prof: {professors.find(p => p.id === job.commissionedProfessorId)?.name || 'Desconhecido'}</div>
                          )}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                           {job.pickupDate ? new Date(job.pickupDate).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                           <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '100px', fontWeight: 600, background: job.paid ? 'rgba(111,207,151,0.1)' : 'rgba(235,87,87,0.1)', color: job.paid ? '#6FCF97' : '#EB5757' }}>
                             {job.paid ? 'PAGO' : 'AGUARDA PGTO'}
                           </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: job.paid ? '#6FCF97' : 'var(--text-secondary)' }}>
                           {job.paid ? `R$ ${commission.toFixed(2)}` : 'R$ 0.00'}
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

    </div>
  );
};
