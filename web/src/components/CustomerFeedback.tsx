import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smile, CircleDollarSign, X } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';

export const CustomerFeedback = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const LOGGED_IN_CUSTOMER = currentUser?.name || 'Cliente';

  const [jobs, setJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('racket'); // 'racket' or 'all'
  const [selectedRacket, setSelectedRacket] = useState('');
  
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeFeedbackJob, setActiveFeedbackJob] = useState<any>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('tt_auth_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/api/jobs`, { headers });
        if (res.ok) {
          const data = await res.json();
          // Initialize feedback if missing (from API, we might not have it yet, but we will store it locally or just leave it)
          setJobs(data);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  const saveJobs = (newJobs: any[]) => {
    setJobs(newJobs);
    // Ideally we would save the feedback back to the API. For now we only update local state since API doesn't support feedback yet.
  };

  const customerJobs = jobs.filter((j: any) => 
    (currentUser?.numericId && String(j.customerId) === String(currentUser.numericId)) || 
    (currentUser?.name && j.customerName === currentUser.name)
  );
  const uniqueRackets = Array.from(new Set(customerJobs.map((j: any) => j.racketModel).filter(Boolean)));

  useEffect(() => {
    if (uniqueRackets.length > 0 && !selectedRacket) {
      setSelectedRacket(uniqueRackets[uniqueRackets.length - 1] as string);
    }
  }, [uniqueRackets, selectedRacket]);

  const racketJobs = customerJobs.filter((j: any) => j.racketModel === selectedRacket);
  const displayedJobs = activeTab === 'all' ? customerJobs : racketJobs;

  return (
    <div style={{ minHeight: '100vh', padding: '120px 5% 40px', maxWidth: '1400px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'var(--bg-panel)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
          Meu Encordoamento
        </h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ background: 'var(--bg-panel-solid)', borderRadius: '24px', overflow: 'hidden' }}>
        
        {/* Header Area */}
        <div style={{ background: '#FFFFFF', padding: '24px 40px', borderBottom: '1px solid #E5E7EB', display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#2D1E4B', fontSize: '20px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
            {activeTab === 'racket' ? (
              <>
                <select 
                  value={selectedRacket}
                  onChange={(e) => setSelectedRacket(e.target.value)}
                  style={{ padding: '10px 16px', fontSize: '16px', fontWeight: 700, borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F8F9FA', outline: 'none', cursor: 'pointer' }}
                >
                  {uniqueRackets.length > 0 ? (
                    uniqueRackets.map((r: any) => <option key={r} value={r}>{r}</option>)
                  ) : (
                    <option value="">Sem raquetes salvas</option>
                  )}
                </select>
              </>
            ) : (
              `Todo o Histórico de ${LOGGED_IN_CUSTOMER}`
            )}
          </h3>

          <button onClick={() => navigate('/')} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
            <X size={20} /> Fechar
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '32px', padding: '24px 40px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
          <div 
            onClick={() => setActiveTab('racket')} 
            style={{ fontSize: '18px', fontWeight: activeTab === 'racket' ? 800 : 600, color: activeTab === 'racket' ? '#2D1E4B' : '#60A5FA', cursor: 'pointer', transition: 'color 0.2s' }}
          >
            Encordoamentos da raquete
          </div>
          <div 
            onClick={() => setActiveTab('all')} 
            style={{ fontSize: '18px', fontWeight: activeTab === 'all' ? 800 : 600, color: activeTab === 'all' ? '#2D1E4B' : '#60A5FA', cursor: 'pointer', transition: 'color 0.2s' }}
          >
            Todos meus encordoamentos
          </div>
        </div>

        {/* Table Area */}
        <div style={{ padding: '0 40px 40px 40px', background: '#FFFFFF', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-dark)' }}>
            <thead>
              <tr style={{ color: '#6B7280', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '20px 12px', fontWeight: 600 }}>Data</th>
                {activeTab === 'all' && <th style={{ padding: '20px 12px', fontWeight: 600 }}>Raquete</th>}
                <th style={{ padding: '20px 12px', fontWeight: 600 }}>Corda / Tensão</th>
                <th style={{ padding: '20px 12px', fontWeight: 600 }}>Encordoador</th>
                <th style={{ padding: '20px 12px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '20px 12px', fontWeight: 600 }}>Preço</th>
                <th style={{ padding: '20px 12px', fontWeight: 600, textAlign: 'right' }}>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {displayedJobs.map((job: any, index: number) => (
                <tr key={job.id} style={{ borderBottom: '1px solid #F3F4F6', background: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF' }}>
                  <td style={{ padding: '20px 12px', fontSize: '15px', color: '#374151', fontWeight: 500 }}>
                    {job.date ? job.date.split('-').reverse().join('/') : '04/04/2026'}
                  </td>
                  
                  {activeTab === 'all' && (
                    <td style={{ padding: '20px 12px', fontSize: '14px', fontWeight: 700 }}>
                      {job.racketModel}
                    </td>
                  )}
                  
                  <td style={{ padding: '20px 12px', fontSize: '15px' }}>
                    <div style={{fontWeight: 700}}>{job.stringMains || '-'}</div>
                    {job.isHybrid && <div style={{fontWeight: 700}}>{job.stringCross}</div>}
                    <div style={{color: '#4B5563', fontSize: '14px'}}>@{job.tension || job.tensionMain || 'N/A'}</div>
                  </td>
                  
                  <td style={{ padding: '20px 12px', fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>
                    {job.stringerName || job.stringer || 'NTC Pro Stringer'}
                  </td>

                  <td style={{ padding: '20px 12px', fontSize: '13px', fontWeight: 700 }}>
                    {job.type === 'picking_up' ? (
                       <span style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 10px', borderRadius: '6px' }}>Retirar</span>
                    ) : job.type === 'to_string' ? (
                       <span style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: '6px' }}>Fila</span>
                    ) : job.type === 'stringing' ? (
                       <span style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 10px', borderRadius: '6px' }}>Execução</span>
                    ) : (
                       <span style={{ color: '#6B7280', background: '#F3F4F6', padding: '6px 10px', borderRadius: '6px' }}>{job.status?.toUpperCase() || 'OK'}</span>
                    )}
                  </td>
                  
                  <td style={{ padding: '20px 12px', fontSize: '15px', fontWeight: 800 }}>
                    <span style={{color: '#6B7280', fontSize: '12px', fontWeight: 600}}>BRL</span> {job.price ? job.price.toFixed(2) : '120.00'}
                  </td>
                  
                  <td style={{ padding: '20px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 12px', borderRadius: '8px',
                        background: job.paid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: job.paid ? '#10B981' : '#EF4444',
                        fontWeight: 700, fontSize: '13px'
                      }}>
                        <CircleDollarSign size={16} />
                        {job.paid ? 'Pago' : 'Não pago'}
                      </div>
                      <button 
                        onClick={() => { setActiveFeedbackJob(job); setIsFeedbackModalOpen(true); }} 
                        style={{ 
                          background: job.feedback?.comments || job.feedback?.rating ? '#2D1E4B' : '#10B981', 
                          border: 'none', padding: '10px 16px', borderRadius: '8px', color: 'white', 
                          display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                          transition: 'opacity 0.2s'
                        }} 
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <Smile size={18} />
                        {job.feedback?.comments || job.feedback?.power ? 'Ver Feedback' : 'Avaliar Jogo'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {displayedJobs.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: '#6B7280', fontSize: '16px' }}>
                    Você não possui histórico para esta visualização.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        <FeedbackModal 
          isOpen={isFeedbackModalOpen} 
          onClose={() => { setIsFeedbackModalOpen(false); setActiveFeedbackJob(null); }} 
          job={activeFeedbackJob}
          onSaveFeedback={(feedbackData: any) => {
            const newJobs = jobs.map((j: any) => j.id === activeFeedbackJob.id ? { ...j, feedback: feedbackData } : j);
            saveJobs(newJobs);
            setIsFeedbackModalOpen(false);
            setActiveFeedbackJob(null);
          }}
          readOnly={false} // Customer can freely write and edit their feedback
        />
      </AnimatePresence>
    </div>
  );
};
