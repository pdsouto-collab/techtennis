import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Edit, Trash2, Smile } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

export const CustomerHistoryModal = ({ isOpen, onClose, customer, jobs, setJobs, onEdit }: any) => {
  const [activeTab, setActiveTab] = useState('racket'); // 'racket' or 'all'
  const [selectedRacket, setSelectedRacket] = useState('');
  
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeFeedbackJob, setActiveFeedbackJob] = useState<any>(null);

  // Derive customer jobs
  const customerJobs = jobs.filter((j: any) => j.customerName === customer?.name);
  
  // Unique rackets
  const uniqueRackets = Array.from(new Set(customerJobs.map((j: any) => j.racketModel).filter(Boolean)));

  useEffect(() => {
    if (uniqueRackets.length > 0 && !selectedRacket) {
      setSelectedRacket(uniqueRackets[uniqueRackets.length - 1] as string);
    }
  }, [uniqueRackets, selectedRacket]);

  if (!isOpen || !customer) return null;
  
  const racketJobs = customerJobs.filter((j: any) => j.racketModel === selectedRacket);
  const displayedJobs = activeTab === 'all' ? customerJobs : racketJobs;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      zIndex: 150, display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '24px'
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ width: '100%', maxWidth: '1300px', maxHeight: '90vh', background: 'var(--bg-panel-solid)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        
        {/* Modal Header */}
        <div style={{ background: '#FFFFFF', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <h3 style={{ color: '#1A112C', fontSize: '18px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
              {activeTab === 'racket' ? (
                <>
                  <select 
                    value={selectedRacket}
                    onChange={(e) => setSelectedRacket(e.target.value)}
                    style={{ padding: '8px 12px', fontSize: '16px', fontWeight: 700, borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F8F9FA', outline: 'none', cursor: 'pointer' }}
                  >
                    {uniqueRackets.length > 0 ? (
                      uniqueRackets.map((r: any) => <option key={r} value={r}>{r}</option>)
                    ) : (
                      <option value="">Sem raquetes salvas</option>
                    )}
                  </select>
                  {selectedRacket && <span style={{ color: '#9CA3AF', fontWeight: 600 }}>[1]</span>} 
                  {selectedRacket && <span style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '14px' }}>18x20 L3</span>}
                </>
              ) : (
                `Histórico de ${customer.name}`
              )}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '0', overflowY: 'auto', flex: 1, background: '#FFFFFF' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '32px', padding: '24px 32px', borderBottom: '1px solid #E5E7EB' }}>
            <div 
              onClick={() => setActiveTab('racket')} 
              style={{ fontSize: '18px', fontWeight: activeTab === 'racket' ? 800 : 700, color: activeTab === 'racket' ? '#1A112C' : '#60A5FA', cursor: 'pointer' }}
            >
              Encordoamentos da raquete
            </div>
            <div 
              onClick={() => setActiveTab('all')} 
              style={{ fontSize: '18px', fontWeight: activeTab === 'all' ? 800 : 700, color: activeTab === 'all' ? '#1A112C' : '#60A5FA', cursor: 'pointer' }}
            >
              Todos encordoamentos do cliente
            </div>
          </div>

          <div style={{ padding: '0 32px 32px 32px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-dark)' }}>
              <thead>
                <tr style={{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}>Data de Inserção</th>
                  {activeTab === 'all' && <th style={{ padding: '16px 8px', fontWeight: 600 }}>Raquete</th>}
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}>Mains</th>
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}>Crosses</th>
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}>HZ</th>
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}>DT</th>
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}>CH</th>
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}>Encordoador</th>
                  {activeTab === 'all' && <th style={{ padding: '16px 8px', fontWeight: 600 }}>Data do Encord.</th>}
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}>Preço</th>
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}>Horas jogadas</th>
                  <th style={{ padding: '16px 8px', fontWeight: 600 }}></th>
                </tr>
              </thead>
              <tbody>
                {displayedJobs.map((job: any, index: number) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #F3F4F6', background: index % 2 === 0 ? '#F8F9FA' : '#FFFFFF' }}>
                    <td style={{ padding: '16px 8px', fontSize: '14px', color: '#374151' }}>{job.date ? `${job.date}` : new Date(job.createdAt).toLocaleString('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
                    {activeTab === 'all' && (
                      <td style={{ padding: '16px 8px', fontSize: '13px', fontWeight: 700 }}>
                        {job.racketModel}
                      </td>
                    )}
                    <td style={{ padding: '16px 8px', fontSize: '14px' }}>
                       <div style={{fontWeight: 700}}>{job.stringMains || '-'} <span style={{color: '#4B5563'}}>@{job.tensionMain || job.tension?.split('/')[0] || '-'} {job.tensionUnit || 'Lbs'}</span></div>
                    </td>
                    <td style={{ padding: '16px 8px', fontSize: '14px' }}>
                       <div style={{fontWeight: 700}}>{job.stringCross || job.stringMains || '-'} <span style={{color: '#4B5563'}}>@{job.tensionCross || job.tension?.split('/')[1] || job.tension?.split('/')[0] || '-'} {job.tensionUnit || 'Lbs'}</span></div>
                    </td>
                    <td style={{ padding: '16px 8px', fontSize: '14px' }}>-</td>
                    <td style={{ padding: '16px 8px', fontSize: '14px' }}>-</td>
                    <td style={{ padding: '16px 8px', fontSize: '14px' }}>-</td>
                    <td style={{ padding: '16px 8px', fontSize: '13px', color: '#6B7280' }}>{job.stringerName ? job.stringerName : job.commissionedProfessorId ? 'Prof. Comissionado' : '-'}</td>
                    {activeTab === 'all' && (
                      <td style={{ padding: '16px 8px', fontSize: '13px', color: '#6B7280' }}>
                        {job.updatedAt ? new Date(job.updatedAt).toLocaleString('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'}) : '---'}
                      </td>
                    )}
                    <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 800 }}>
                      <span style={{color: '#6B7280', fontSize: '12px', fontWeight: 600}}>BRL</span> {job.price ? job.price.toFixed(2) : '120.00'}
                    </td>
                    <td style={{ padding: '16px 8px', fontSize: '14px' }}>-</td>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => { setActiveFeedbackJob(job); setIsFeedbackModalOpen(true); }} style={{ background: '#10B981', border: 'none', width: '28px', height: '28px', borderRadius: '4px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Smile size={14} /></button>
                        <button onClick={() => onEdit(job)} style={{ background: '#4298E7', border: 'none', width: '28px', height: '28px', borderRadius: '4px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Edit size={14} /></button>
                        <button onClick={() => { if(window.confirm('Tem certeza que deseja excluir?')) setJobs(jobs.filter((j: any) => j.id !== job.id)); }} style={{ background: '#D93B65', border: 'none', width: '28px', height: '28px', borderRadius: '4px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayedJobs.length === 0 && (
                  <tr>
                    <td colSpan={12} style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>Nenhum encordoamento encontrado para este cliente.</td>
                  </tr>
                )}
              </tbody>
            </table>

             {/* Pagination footer */}
             {displayedJobs.length > 0 && (
                <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6B7280', fontSize: '13px', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Mostrando</span>
                    <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #E5E7EB', background: '#F8F9FA' }}>
                      <option>10</option>
                    </select>
                    <span>registros</span>
                    <span style={{ marginLeft: '16px' }}>1 a {displayedJobs.length} de {displayedJobs.length} registros</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'not-allowed', fontWeight: 600 }}>Anterior</button>
                    <button style={{ border: 'none', background: '#4298E7', color: 'white', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>1</button>
                    <button style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'not-allowed', fontWeight: 600 }}>Próximo</button>
                  </div>
                </div>
             )}
          </div>
        </div>
      </motion.div>

      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => { setIsFeedbackModalOpen(false); setActiveFeedbackJob(null); }} 
        job={activeFeedbackJob}
        onSaveFeedback={(feedbackData: any) => {
          setJobs(jobs.map((j: any) => j.id === activeFeedbackJob.id ? { ...j, feedback: feedbackData } : j));
          setIsFeedbackModalOpen(false);
          setActiveFeedbackJob(null);
        }}
        readOnly={true} // Stringer can only view feedback
      />
    </div>
  );
};
