import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Calendar, BarChart2, Plus, Edit, Trash2, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const ClassManagementProfessor = () => {
  const navigate = useNavigate();

  // Local Storage Data
  const [professors] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_professors');
    return saved ? JSON.parse(saved) : [];
  });
  

  const [students, setStudents] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_class_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [classes, setClasses] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_classes');
    return saved ? JSON.parse(saved) : [];
  });

  // State
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'students' | 'agenda' | 'reports'>('agenda');
  
  // Modals & Forms
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<any>(null);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isBulkClass, setIsBulkClass] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [formIsResidential, setFormIsResidential] = useState(false);
  
  // Analytics State
  const [activeReportFilter, setActiveReportFilter] = useState({ month: new Date().toISOString().substring(0,7), student: '' });
  
  // Persist Changes
  useEffect(() => { localStorage.setItem('tt_class_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('tt_classes', JSON.stringify(classes)); }, [classes]);

  return (
    <div style={{ minHeight: '100vh', padding: '120px 5% 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'var(--bg-panel)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
          Gestão de Aulas
        </h1>
      </div>

      {/* Professor Selector */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <label style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Logado como (Professor):</label>
        <select 
          value={selectedProfessorId} 
          onChange={(e) => setSelectedProfessorId(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', minWidth: '250px' }}
        >
          <option value="">Selecione o professor para começar...</option>
          {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {selectedProfessorId ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ background: 'var(--bg-panel-solid)', borderRadius: '24px', overflow: 'hidden' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '32px', padding: '24px 40px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
            <div onClick={() => setActiveTab('agenda')} style={{ fontSize: '18px', fontWeight: activeTab === 'agenda' ? 800 : 600, color: activeTab === 'agenda' ? '#1a1a2e' : '#60A5FA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} /> Agenda
            </div>
            <div onClick={() => setActiveTab('students')} style={{ fontSize: '18px', fontWeight: activeTab === 'students' ? 800 : 600, color: activeTab === 'students' ? '#1a1a2e' : '#60A5FA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} /> Meus Alunos
            </div>
            <div onClick={() => setActiveTab('reports')} style={{ fontSize: '18px', fontWeight: activeTab === 'reports' ? 800 : 600, color: activeTab === 'reports' ? '#1a1a2e' : '#60A5FA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={20} /> Relatórios Financeiros
            </div>
          </div>

          <div style={{ padding: '40px', background: '#F8F9FA', minHeight: '500px' }}>
            
            {activeTab === 'students' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Meus Alunos / Clientes</h2>
                  <button 
                    onClick={() => { setActiveStudent(null); setFormIsResidential(false); setIsStudentModalOpen(true); }}
                    className="button-primary" style={{ padding: '10px 20px', fontSize: '15px', color: 'var(--text-dark)' }}
                  >
                    <Plus size={18} /> Novo Aluno
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {students.filter(s => s.professorId === selectedProfessorId).length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', color: 'var(--text-secondary)' }}>
                      Você ainda não possui alunos cadastrados.
                    </div>
                  ) : (
                    students.filter(s => s.professorId === selectedProfessorId).map(student => (
                      <div key={student.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1a1a2e' }}>{student.name}</h3>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => { setActiveStudent(student); setFormIsResidential(student.isResidential || false); setIsStudentModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60A5FA' }}><Edit size={16} /></button>
                            <button onClick={() => {
                              if(window.confirm('Excluir este aluno? O histórico de aulas será mantido.')){
                                setStudents(prev => prev.filter(s => s.id !== student.id));
                              }
                            }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', color: '#4B5563' }}>
                          {student.phone ? <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>📞 <span style={{ fontWeight: 500 }}>{student.phone}</span></div> : null}
                          {student.isResidential ? <div style={{ color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>🏡 <span>{student.condoName ? `${student.condoName}` : 'Condomínio / Residencial'}</span></div> : null}
                          {student.level ? <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>⭐ <span style={{ fontWeight: 500 }}>{student.level}</span></div> : null}
                        </div>
                        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', color: '#6B7280' }}>Valor Hora/Aula:</span>
                          <span style={{ fontWeight: 800, color: '#10B981', fontSize: '16px' }}>{student.hourlyRate ? `R$ ${student.hourlyRate.toFixed(2)}` : 'Não definido'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'agenda' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Agenda de Aulas</h2>
                  <button 
                    onClick={() => {
                      setIsBulkClass(false);
                      setSelectedDays([]);
                      setIsClassModalOpen(true);
                    }}
                    className="button-primary" style={{ padding: '10px 20px', fontSize: '15px', color: 'var(--text-dark)' }}
                    disabled={students.filter(s => s.professorId === selectedProfessorId).length === 0}
                  >
                    <Calendar size={18} /> Agendar Aula
                  </button>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: '16px', alignItems: 'center', background: '#f9fafb' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#60A5FA' }}></span> Planejada
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></span> Realizada
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></span> Cancelada
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></span> Chuva
                    </div>
                  </div>
                  
                  {classes.filter(c => c.professorId === selectedProfessorId).length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhuma aula agendada.</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '14px' }}>
                          <th style={{ padding: '16px 24px', fontWeight: 600 }}>Data / Hora</th>
                          <th style={{ padding: '16px 24px', fontWeight: 600 }}>Aluno</th>
                          <th style={{ padding: '16px 24px', fontWeight: 600 }}>Local</th>
                          <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...classes].filter(c => c.professorId === selectedProfessorId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(cls => {
                          const student = students.find(s => s.id === cls.studentId);
                          return (
                            <tr key={cls.id} style={{ borderBottom: '1px solid #F3F4F6', background: cls.status === 'completed' ? 'rgba(16,185,129,0.05)' : cls.status.includes('cancelled') ? 'rgba(239,68,68,0.05)' : cls.status === 'rain' ? 'rgba(245,158,11,0.05)' : 'white' }}>
                              <td style={{ padding: '16px 24px' }}>
                                <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{cls.date.split('-').reverse().join('/')}</div>
                                <div style={{ fontSize: '13px', color: '#6B7280' }}>{cls.timeStart} - {cls.timeEnd}</div>
                              </td>
                              <td style={{ padding: '16px 24px', fontWeight: 600, color: '#1a1a2e' }}>{student?.name || 'Desconhecido'}</td>
                              <td style={{ padding: '16px 24px', color: '#6B7280', fontSize: '14px' }}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }}/> {cls.location || 'Não informado'}</td>
                              <td style={{ padding: '16px 24px' }}>
                                <select 
                                  value={cls.status}
                                  onChange={(e) => {
                                    setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, status: e.target.value } : c));
                                  }}
                                  style={{ padding: '6px 12px', borderRadius: '100px', border: '1px solid #E5E7EB', fontSize: '13px', fontWeight: 600, background: 'white', color: cls.status === 'planned' ? '#60A5FA' : cls.status === 'completed' ? '#10B981' : cls.status === 'rain' ? '#F59E0B' : '#EF4444' }}
                                >
                                  <option value="planned">Planejada</option>
                                  <option value="completed">Realizada</option>
                                  <option value="replacement">Reposição</option>
                                  <option value="cancelled_student">Canc. Aluno</option>
                                  <option value="cancelled_prof">Canc. Professor</option>
                                  <option value="rain">Chuva</option>
                                </select>
                                {(cls.status === 'rain' || cls.status.includes('cancelled')) && (
                                  <div style={{ marginTop: '8px', fontSize: '12px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                      <input type="checkbox" checked={!!cls.willHaveReplacement} onChange={(e) => {
                                        setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, willHaveReplacement: e.target.checked } : c));
                                      }} style={{ accentColor: 'var(--primary-color)' }} />
                                      Haverá Reposição
                                    </label>
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                <button onClick={() => {
                                  if(window.confirm('Excluir esta aula?')) setClasses(prev => prev.filter(c => c.id !== cls.id));
                                }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Relatórios Financeiros</h2>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <select id="reportMonth" defaultValue={new Date().toISOString().substring(0,7)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white' }}>
                      <option value="2026-03">Março 2026</option>
                      <option value="2026-04">Abril 2026</option>
                      <option value="2026-05">Maio 2026</option>
                    </select>
                    <select id="reportStudent" defaultValue="" style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white', minWidth: '200px' }}>
                      <option value="">Todos os Alunos</option>
                      {students.filter(s => s.professorId === selectedProfessorId).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <button className="button-primary" style={{ padding: '10px 20px', color: 'var(--text-dark)' }} onClick={() => {
                        const month = (document.getElementById('reportMonth') as HTMLSelectElement).value;
                        const student = (document.getElementById('reportStudent') as HTMLSelectElement).value;
                        setActiveReportFilter({ month, student });
                    }}>
                      Filtrar
                    </button>
                  </div>
                </div>

                {/* Report Content */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                  <div style={{ background: '#10B981', color: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(16,185,129,0.2)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', opacity: 0.9 }}>Total Financeiro (Aulas Realizadas)</h3>
                    <div style={{ fontSize: '32px', fontWeight: 800 }}>R$ {
                      classes.filter(c => c.professorId === selectedProfessorId && c.status === 'completed' && c.date.startsWith(activeReportFilter.month) && (activeReportFilter.student === '' || c.studentId === activeReportFilter.student))
                             .reduce((acc, cls) => {
                               const student = students.find(s => s.id === cls.studentId);
                               if(!student || !student.hourlyRate) return acc;
                               const start = new Date(`1970-01-01T${cls.timeStart}:00`);
                               const end = new Date(`1970-01-01T${cls.timeEnd}:00`);
                               const hours = (end.getTime() - start.getTime()) / 3600000;
                               return acc + (hours * student.hourlyRate);
                             }, 0).toFixed(2)
                    }</div>
                  </div>
                  <div style={{ background: 'white', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-secondary)' }}>Horas de Aula (Realizadas)</h3>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-dark)' }}>{
                      classes.filter(c => c.professorId === selectedProfessorId && c.status === 'completed' && c.date.startsWith(activeReportFilter.month) && (activeReportFilter.student === '' || c.studentId === activeReportFilter.student))
                             .reduce((acc, cls) => {
                               const start = new Date(`1970-01-01T${cls.timeStart}:00`);
                               const end = new Date(`1970-01-01T${cls.timeEnd}:00`);
                               return acc + ((end.getTime() - start.getTime()) / 3600000);
                             }, 0).toFixed(1)
                    } hr</div>
                  </div>
                  {(() => {
                    const balance = classes.filter(c => c.professorId === selectedProfessorId && (activeReportFilter.student === '' || c.studentId === activeReportFilter.student))
                                           .reduce((acc, c) => {
                                             if (!c.timeStart || !c.timeEnd) return acc;
                                             const h = (new Date(`1970-01-01T${c.timeEnd}:00`).getTime() - new Date(`1970-01-01T${c.timeStart}:00`).getTime()) / 3600000;
                                             if ((c.status === 'rain' || c.status.includes('cancelled')) && c.willHaveReplacement) return acc + h;
                                             if (c.status === 'replacement') return acc - h;
                                             return acc;
                                           }, 0);
                    return (
                      <div style={{ background: '#F59E0B', color: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(245,158,11,0.2)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', opacity: 0.9 }}>Horas para Reposição</h3>
                        <div style={{ fontSize: '32px', fontWeight: 800 }}>{balance.toFixed(1)} hr</div>
                      </div>
                    );
                  })()}
                </div>

                {/* Table of report details */}
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px 24px' }}>Data</th>
                            <th style={{ padding: '12px 24px' }}>Aluno</th>
                            <th style={{ padding: '12px 24px' }}>Status</th>
                            <th style={{ padding: '12px 24px' }}>Duração</th>
                            <th style={{ padding: '12px 24px', textAlign: 'right' }}>Valor a Cobrar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classes.filter(c => c.professorId === selectedProfessorId && c.date.startsWith(activeReportFilter.month) && (activeReportFilter.student === '' || c.studentId === activeReportFilter.student)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(cls => {
                            const student = students.find(s => s.id === cls.studentId);
                            const start = new Date(`1970-01-01T${cls.timeStart}:00`);
                            const end = new Date(`1970-01-01T${cls.timeEnd}:00`);
                            const hours = (end.getTime() - start.getTime()) / 3600000;
                            const value = (student && student.hourlyRate && cls.status === 'completed') ? hours * student.hourlyRate : 0;
                            
                            return (
                              <tr key={cls.id} style={{ borderBottom: '1px solid #F3F4F6', opacity: cls.status !== 'completed' ? 0.6 : 1, color: '#1a1a2e' }}>
                                <td style={{ padding: '12px 24px', fontWeight: 600, color: '#1a1a2e' }}>{cls.date.split('-').reverse().join('/')}</td>
                                <td style={{ padding: '12px 24px', color: '#1a1a2e' }}>{student?.name || '-'}</td>
                                <td style={{ padding: '12px 24px', color: '#1a1a2e' }}>{cls.status === 'completed' ? 'Realizada' : cls.status === 'replacement' ? 'Reposição' : cls.status === 'rain' ? 'Chuva' : cls.status.includes('cancelled') ? 'Cancelada' : 'Planejada'}</td>
                                <td style={{ padding: '12px 24px', color: '#1a1a2e' }}>{hours.toFixed(1)}h</td>
                                <td style={{ padding: '12px 24px', textAlign: 'right', fontWeight: 700, color: cls.status === 'completed' ? '#10B981' : 'var(--text-secondary)' }}>
                                  R$ {value.toFixed(2)}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                </div>

              </motion.div>
            )}
          </div>

        </motion.div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
          Por favor, selecione um professor no painel acima para visualizar a gestão de aulas.
        </div>
      )}

      {/* Student Modal */}
      <AnimatePresence>
        {isStudentModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,12,60,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'var(--bg-panel-solid)', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', color: 'white', margin: 0, fontFamily: 'var(--font-heading)' }}>{activeStudent ? 'Editar Aluno' : 'Novo Aluno'}</h2>
                <button onClick={() => setIsStudentModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <form key={activeStudent ? activeStudent.id : 'new_form'} onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const studentData = {
                  id: activeStudent ? activeStudent.id : Date.now().toString(),
                  professorId: selectedProfessorId,
                  name: formData.get('name'),
                  phone: formData.get('phone'),
                  address: formData.get('address'),
                  level: formData.get('level'),
                  isResidential: formIsResidential,
                  condoName: formIsResidential ? formData.get('condoName') : null,
                  hourlyRate: formData.get('hourlyRate') ? Number(formData.get('hourlyRate')) : null,
                  createdAt: activeStudent ? activeStudent.createdAt : new Date().toISOString()
                };
                if (activeStudent) {
                  setStudents(prev => prev.map(s => s.id === activeStudent.id ? studentData : s));
                } else {
                  setStudents(prev => [...prev, studentData]);
                }
                setIsStudentModalOpen(false);
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Nome do Aluno *</label>
                    <input name="name" required defaultValue={activeStudent?.name} type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Telefone</label>
                    <input name="phone" defaultValue={activeStudent?.phone} type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Endereço</label>
                    <input name="address" defaultValue={activeStudent?.address} type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.1)', padding: '12px 16px', borderRadius: '8px' }}>
                    <input name="isResidential" checked={formIsResidential} onChange={(e) => setFormIsResidential(e.target.checked)} type="checkbox" id="resCheckbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }} />
                    <label htmlFor="resCheckbox" style={{ color: 'white', cursor: 'pointer' }}>Aulas em Condomínio / Residencial</label>
                  </div>
                  {formIsResidential && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Qual Condomínio / Residencial?</label>
                      <input name="condoName" defaultValue={activeStudent?.condoName} type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }} placeholder="Nome do local..." />
                    </motion.div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Nível</label>
                      <select name="level" defaultValue={activeStudent?.level || ''} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                        <option value="">Selecione...</option>
                        <option value="Iniciante">Iniciante</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Avançado">Avançado</option>
                        <option value="Competidor">Competidor</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Valor Hora/Aula (R$)</label>
                      <input name="hourlyRate" defaultValue={activeStudent?.hourlyRate} type="number" step="0.01" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }} placeholder="Opcional" />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                  <button type="button" onClick={() => setIsStudentModalOpen(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                  <button type="submit" className="button-primary" style={{ padding: '12px 32px', color: 'var(--text-dark)' }}>{activeStudent ? 'Salvar Edição' : 'Adicionar Aluno'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Class Modal */}
      <AnimatePresence>
        {isClassModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,12,60,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'var(--bg-panel-solid)', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', color: 'white', margin: 0, fontFamily: 'var(--font-heading)' }}>Agendar Aula</h2>
                <button onClick={() => setIsClassModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const timeStart = formData.get('timeStart');
                const timeEnd = formData.get('timeEnd');
                const location = formData.get('location');
                const studentId = formData.get('studentId');

                if (isBulkClass) {
                  if (selectedDays.length === 0) {
                    alert('Selecione pelo menos um dia da semana para o agendamento em lote.');
                    return;
                  }
                  
                  const startStr = formData.get('startDate') as string;
                  const endStr = formData.get('endDate') as string;
                  const [sy, sm, sd] = startStr.split('-').map(Number);
                  const [ey, em, ed] = endStr.split('-').map(Number);
                  const start = new Date(sy, sm - 1, sd);
                  const end = new Date(ey, em - 1, ed);
                  
                  if (start > end) {
                    alert('A Data Início não pode ser maior que a Data Fim.');
                    return;
                  }

                  const newClasses: any[] = [];
                  let curr = new Date(start);
                  let safety = 0;
                  while (curr <= end && safety < 366) {
                    if (selectedDays.includes(curr.getDay())) {
                      const y = curr.getFullYear();
                      const m = String(curr.getMonth() + 1).padStart(2, '0');
                      const d = String(curr.getDate()).padStart(2, '0');
                      newClasses.push({
                        id: Date.now().toString() + Math.random().toString(),
                        professorId: selectedProfessorId,
                        studentId: studentId,
                        date: `${y}-${m}-${d}`,
                        timeStart,
                        timeEnd,
                        location,
                        status: 'planned'
                      });
                    }
                    curr.setDate(curr.getDate() + 1);
                    safety++;
                  }
                  
                  if (newClasses.length === 0) {
                    alert("Nenhuma aula foi agendada. Verifique se os dias da semana selecionados ocorrem dentro do período escolhido.");
                    return;
                  }
                  
                  setClasses(prev => [...prev, ...newClasses]);
                } else {
                  const classData = {
                    id: Date.now().toString(),
                    professorId: selectedProfessorId,
                    studentId: studentId,
                    date: formData.get('date'),
                    timeStart,
                    timeEnd,
                    location,
                    status: 'planned'
                  };
                  setClasses(prev => [...prev, classData]);
                }
                
                setIsClassModalOpen(false);
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Aluno *</label>
                    <select name="studentId" required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                      <option value="">Selecione o Aluno</option>
                      {students.filter(s => s.professorId === selectedProfessorId).map(s => (
                        <option key={s.id} value={s.id}>{s.name} {s.isResidential ? '(Residencial)' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <input type="checkbox" id="bulkCheck" checked={isBulkClass} onChange={e => setIsBulkClass(e.target.checked)} style={{ accentColor: 'var(--primary-color)' }} />
                    <label htmlFor="bulkCheck" style={{ color: 'white', cursor: 'pointer', fontSize: '14px' }}>Agendamento em Lote (Recorrente)</label>
                  </div>

                  {!isBulkClass ? (
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Data *</label>
                      <input name="date" required type="date" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white', colorScheme: 'dark' }} />
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Data Início *</label>
                          <input name="startDate" required type="date" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white', colorScheme: 'dark' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Data Fim *</label>
                          <input name="endDate" required type="date" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white', colorScheme: 'dark' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Dias da Semana *</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {[
                            { label: 'Dom', val: 0 },
                            { label: 'Seg', val: 1 },
                            { label: 'Ter', val: 2 },
                            { label: 'Qua', val: 3 },
                            { label: 'Qui', val: 4 },
                            { label: 'Sex', val: 5 },
                            { label: 'Sáb', val: 6 },
                          ].map(day => (
                            <div 
                              key={day.val} 
                              onClick={() => setSelectedDays(prev => prev.includes(day.val) ? prev.filter(d => d !== day.val) : [...prev, day.val])}
                              style={{ padding: '6px 12px', borderRadius: '100px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: selectedDays.includes(day.val) ? '#60A5FA' : 'rgba(255,255,255,0.1)', color: selectedDays.includes(day.val) ? '#1a1a2e' : 'white' }}
                            >
                              {day.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Início *</label>
                      <input name="timeStart" required type="time" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white', colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Fim *</label>
                      <input name="timeEnd" required type="time" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white', colorScheme: 'dark' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Local</label>
                    <input name="location" type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }} placeholder="Ex: Quadra 4, Condominio XYZ..." />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                  <button type="button" onClick={() => setIsClassModalOpen(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                  <button type="submit" className="button-primary" style={{ padding: '12px 32px', color: 'var(--text-dark)' }}>Confirmar Agendamento</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

