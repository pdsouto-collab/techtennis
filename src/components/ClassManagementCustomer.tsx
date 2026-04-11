import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, BarChart2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ClassManagementCustomer = () => {
  const navigate = useNavigate();

  // Local Storage Data
  const [professors] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_professors');
    return saved ? JSON.parse(saved) : [];
  });

  const [students] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_class_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [classes] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_classes');
    return saved ? JSON.parse(saved) : [];
  });

  // State
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'agenda' | 'history'>('agenda');
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().substring(0,7));

  // Find active student context
  const activeStudent = students.find(s => s.id === selectedStudentId);
  const activeProfessor = activeStudent ? professors.find(p => p.id === activeStudent.professorId) : null;

  return (
    <div style={{ minHeight: '100vh', padding: '120px 5% 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'var(--bg-panel)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
          Minhas Aulas
        </h1>
      </div>

      {/* Customer Selector (Mock Login) */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <label style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Acessar como Aluno:</label>
        <select 
          value={selectedStudentId} 
          onChange={(e) => setSelectedStudentId(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', minWidth: '300px' }}
        >
          <option value="">Selecione sua conta...</option>
          {students.map(s => {
            const prof = professors.find(p => p.id === s.professorId);
            return (
              <option key={s.id} value={s.id}>{s.name} {prof ? `(Prof. ${prof.name})` : ''}</option>
            );
          })}
        </select>
      </div>

      {activeStudent ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ background: 'var(--bg-panel-solid)', borderRadius: '24px', overflow: 'hidden' }}>
          
          <div style={{ padding: '24px 40px', background: 'linear-gradient(to right, #1a1a2e, #16213e)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>Olá, {activeStudent.name}</h2>
                <div style={{ color: '#60A5FA', fontSize: '14px' }}>Professor(a): {activeProfessor?.name || 'Desconhecido'}</div>
             </div>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Valor Hora/Aula Acordado</div>
               <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>{activeStudent.hourlyRate ? `R$ ${activeStudent.hourlyRate.toFixed(2)}` : 'À Combinar'}</div>
             </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '32px', padding: '16px 40px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
            <div onClick={() => setActiveTab('agenda')} style={{ fontSize: '16px', fontWeight: activeTab === 'agenda' ? 800 : 600, color: activeTab === 'agenda' ? '#1a1a2e' : '#60A5FA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} /> Aulas Agendadas
            </div>
            <div onClick={() => setActiveTab('history')} style={{ fontSize: '16px', fontWeight: activeTab === 'history' ? 800 : 600, color: activeTab === 'history' ? '#1a1a2e' : '#60A5FA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} /> Histórico e Extrato
            </div>
          </div>

          <div style={{ padding: '40px', background: '#F8F9FA', minHeight: '500px' }}>
            
            {activeTab === 'agenda' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '24px' }}>Próximas Aulas (Planejadas)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {classes.filter(c => c.studentId === activeStudent.id && c.status === 'planned').length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', color: 'var(--text-secondary)' }}>Você não tem aulas futuras agendadas.</div>
                  ) : (
                    classes.filter(c => c.studentId === activeStudent.id && c.status === 'planned')
                           .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                           .map(cls => (
                             <div key={cls.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '24px', borderRadius: '16px', borderLeft: '4px solid #60A5FA', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                               <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                 <div style={{ background: 'rgba(96,165,250,0.1)', color: '#2563EB', padding: '12px 20px', borderRadius: '12px', textAlign: 'center' }}>
                                   <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>{new Date(`${cls.date}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                                   <div style={{ fontSize: '24px', fontWeight: 800 }}>{cls.date.split('-')[2]}</div>
                                 </div>
                                 <div>
                                   <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>{cls.timeStart} às {cls.timeEnd}</div>
                                   <div style={{ fontSize: '14px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> {cls.location || 'Local não informado'}</div>
                                 </div>
                               </div>
                               <div style={{ background: 'rgba(96,165,250,0.1)', color: '#2563EB', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 700 }}>
                                 Planejada
                               </div>
                             </div>
                           ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Histórico do Mês</h3>
                  <select 
                    value={reportMonth} 
                    onChange={e => setReportMonth(e.target.value)}
                    style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white' }}>
                    <option value="2026-03">Março 2026</option>
                    <option value="2026-04">Abril 2026</option>
                    <option value="2026-05">Maio 2026</option>
                  </select>
                </div>

                {/* Dashboard Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                  {(() => {
                    const monthClasses = classes.filter(c => c.studentId === activeStudent.id && c.date.startsWith(reportMonth));
                    const completed = monthClasses.filter(c => c.status === 'completed');
                    const hours = completed.reduce((acc, c) => acc + ((new Date(`1970-01-01T${c.timeEnd}:00`).getTime() - new Date(`1970-01-01T${c.timeStart}:00`).getTime()) / 3600000), 0);
                    const totalCost = activeStudent.hourlyRate ? hours * activeStudent.hourlyRate : 0;

                    return (
                      <>
                        <div style={{ background: 'white', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '16px' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Aulas Realizadas</h4>
                          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-dark)' }}>{completed.length}</div>
                        </div>
                        <div style={{ background: 'white', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '16px' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Total de Horas</h4>
                          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-dark)' }}>{hours.toFixed(1)}h</div>
                        </div>
                        <div style={{ background: '#10B981', color: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(16,185,129,0.2)' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Acerto do Mês</h4>
                          <div style={{ fontSize: '32px', fontWeight: 800 }}>R$ {totalCost.toFixed(2)}</div>
                        </div>
                      </>
                    )
                  })()}
                </div>

                {/* Listing */}
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '16px 24px' }}>Data</th>
                            <th style={{ padding: '16px 24px' }}>Horário</th>
                            <th style={{ padding: '16px 24px' }}>Status</th>
                            <th style={{ padding: '16px 24px', textAlign: 'right' }}>Cobrança</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classes.filter(c => c.studentId === activeStudent.id && c.date.startsWith(reportMonth) && c.status !== 'planned')
                                  .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                  .map(cls => {
                            
                            const start = new Date(`1970-01-01T${cls.timeStart}:00`);
                            const end = new Date(`1970-01-01T${cls.timeEnd}:00`);
                            const hours = (end.getTime() - start.getTime()) / 3600000;
                            const value = (activeStudent.hourlyRate && cls.status === 'completed') ? hours * activeStudent.hourlyRate : 0;
                            
                            let statusConfig = { color: '#6B7280', bg: '#F3F4F6', label: 'Desconhecido' };
                            if (cls.status === 'completed') statusConfig = { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Realizada' };
                            if (cls.status === 'rain') statusConfig = { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Chuva (Abonada)' };
                            if (cls.status.includes('cancelled')) statusConfig = { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Cancelada' };

                            return (
                              <tr key={cls.id} style={{ borderBottom: '1px solid #F3F4F6', opacity: cls.status !== 'completed' ? 0.7 : 1 }}>
                                <td style={{ padding: '16px 24px', fontWeight: 600 }}>{cls.date.split('-').reverse().join('/')}</td>
                                <td style={{ padding: '16px 24px', color: '#4B5563' }}>{cls.timeStart} às {cls.timeEnd}</td>
                                <td style={{ padding: '16px 24px' }}>
                                  <span style={{ background: statusConfig.bg, color: statusConfig.color, padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }}>
                                    {statusConfig.label}
                                  </span>
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: cls.status === 'completed' ? '#10B981' : 'var(--text-secondary)' }}>
                                  {cls.status === 'completed' ? `R$ ${value.toFixed(2)}` : '-'}
                                </td>
                              </tr>
                            )
                          })}
                          {classes.filter(c => c.studentId === activeStudent.id && c.date.startsWith(reportMonth) && c.status !== 'planned').length === 0 && (
                            <tr>
                              <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum histórico encontrado para o mês selecionado.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                </div>

              </motion.div>
            )}

          </div>

        </motion.div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
          Por favor, selecione sua conta no painel acima para visualizar suas aulas.
        </div>
      )}

    </div>
  );
};
