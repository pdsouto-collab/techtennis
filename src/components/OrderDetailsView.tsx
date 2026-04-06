import { useState } from 'react';
import { motion } from 'framer-motion';
import { PackageOpen, Scissors, Truck, Users, ArrowLeft, ArrowRight, Edit, Plus, DollarSign, Ticket, Printer, Grid, Trash2 } from 'lucide-react';

export const OrderDetailsView = ({ view, setView, activeOrderJob, jobs, setJobs, setActiveStringingJob, setActivePaymentJob, setIsPaymentModalOpen, customers, setSelectedCustomer, setNewJobStep, setActiveFilter, setIsCustomerModalOpen }: any) => {
  const [isEditingPickup, setIsEditingPickup] = useState(false);
  const [pickupDate, setPickupDate] = useState(activeOrderJob?.pickupDate || '2026-04-04T12:30');
  const [pickupNotes, setPickupNotes] = useState(activeOrderJob?.pickupNotes || '');

  import('react').then(React => {
     React.useEffect(() => {
        if (activeOrderJob) {
           setPickupDate(activeOrderJob.pickupDate || '2026-04-04T12:30');
           setPickupNotes(activeOrderJob.pickupNotes || '');
           setIsEditingPickup(false);
        }
     }, [activeOrderJob]);
  });

  if (view !== 'order_details' || !activeOrderJob) return null;

  const activeCustomer = customers?.find((c: any) => c.name === activeOrderJob.customerName);
  const orderJobs = jobs.filter((j: any) => j.customerName === activeOrderJob.customerName);
  const totalJobs = orderJobs.length;
  const completedJobs = orderJobs.filter((j: any) => j.type === 'picking_up').length;
  const progressPercent = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
  const isFullyPaid = !orderJobs.some((j: any) => !j.paid);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <ArrowLeft size={20} /> Voltar ao Dashboard
        </button>
      </div>

      {/* Top Status Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <button onClick={() => { setView('new_job'); setNewJobStep(1); }} style={{ background: '#D93B65', color: 'white', border: 'none', padding: '16px 24px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <PackageOpen size={20} /> Recebimento
        </button>
        <button onClick={() => { setView('dashboard'); setActiveFilter('to_string'); }} style={{ background: '#F2C94C', color: 'var(--text-dark)', border: 'none', padding: '16px 24px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <Scissors size={20} /> Para Encordoar: {jobs.filter((j: any) => j.type === 'to_string').length}
        </button>
        <button onClick={() => { setView('dashboard'); setActiveFilter('picking_up'); }} style={{ background: '#6FCF97', color: 'var(--text-dark)', border: 'none', padding: '16px 24px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <Truck size={20} /> Para Retirar: {jobs.filter((j: any) => j.type === 'picking_up').length}
        </button>
        <button onClick={() => setView('customers')} style={{ background: '#9B51E0', color: 'white', border: 'none', padding: '16px 24px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <Users size={20} /> Clientes
        </button>
      </div>

      {/* Quick Actions Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '16px' }}>
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'rgba(155, 81, 224, 0.1)' }}>
          <span style={{ color: '#C08DF8', fontWeight: 600, fontSize: '15px' }}>Sem notas para o cliente</span>
          <button style={{ background: '#9B51E0', border: 'none', padding: '10px 24px', borderRadius: '8px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Notas</button>
        </div>
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'rgba(66, 152, 231, 0.1)' }}>
          <span style={{ color: '#7EBDF7', fontWeight: 600, fontSize: '15px' }}>Sem pré-pago para o cliente</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ background: '#4298E7', border: 'none', width: '36px', height: '36px', borderRadius: '8px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>+</button>
            <button style={{ background: '#4298E7', border: 'none', padding: '0 20px', height: '36px', borderRadius: '8px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Pré-pago</button>
          </div>
        </div>
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{fontWeight: 700, fontSize: '15px'}}>Rolo próprio</span> <input type="checkbox" style={{ accentColor: '#D93B65', width: '22px', height: '22px' }} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{fontWeight: 700, fontSize: '15px'}}>Set próprio</span> <input type="checkbox" style={{ accentColor: '#D93B65', width: '22px', height: '22px' }} /></div>
        </div>
      </div>

      {/* Main Order Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* Left Order Info Panel */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-panel)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 12px 0' }}>{activeOrderJob.customerName}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <ArrowRight size={16} strokeWidth={3} /> {activeCustomer?.originClub || 'Gênesis 2'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { if(activeCustomer) { setSelectedCustomer(activeCustomer); setIsCustomerModalOpen(true); } }} style={{ background: '#6136B3', border: 'none', padding: '12px 20px', borderRadius: '8px', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Users size={18}/> Perfil do cliente</button>
                {!isFullyPaid ? (
                  <button onClick={() => {
                    setJobs(jobs.map((j:any) => j.customerName === activeOrderJob.customerName ? { ...j, paid: true } : j));
                  }} style={{ background: '#6FCF97', border: 'none', padding: '12px 20px', borderRadius: '8px', color: 'var(--text-dark)', fontWeight: 700, cursor: 'pointer' }}>Marcar como pago</button>
                ) : (
                  <button onClick={() => {
                    setJobs(jobs.map((j:any) => j.customerName === activeOrderJob.customerName ? { ...j, paid: false } : j));
                  }} style={{ background: '#D93B65', border: 'none', padding: '12px 20px', borderRadius: '8px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancelar pagamento</button>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <div style={{flex: 1}}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Data de entrada <Edit size={12} style={{marginLeft: '4px', cursor: 'pointer'}}/></div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#C08DF8', background: 'rgba(155,81,224,0.1)', padding: '6px 16px', borderRadius: '100px', display: 'inline-block' }}>{activeOrderJob.date}</div>
              </div>
              <div style={{flex: 1}}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Status</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#7EBDF7' }}>{activeOrderJob.type === 'picking_up' ? 'PRONTA' : activeOrderJob.type === 'to_string' ? 'PARA ENCORDOAR' : activeOrderJob.status.toUpperCase()}</div>
              </div>
              <div style={{ flex: 1.5 }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Progresso</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontWeight: 800, fontSize: '16px' }}>{progressPercent}%</div>
                    <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: progressPercent === 100 ? '#6FCF97' : '#DDE83D', borderRadius: '5px' }}></div>
                    </div>
                  </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '32px' }}>
              <div style={{ background: 'rgba(66,152,231,0.1)', border: '1px solid rgba(66,152,231,0.2)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#7EBDF7', marginBottom: '8px', fontWeight: 600 }}>Ponto de encordoamento</div>
                  <div style={{ fontWeight: 800, fontSize: '18px' }}>Test</div>
              </div>
              <div style={{ background: 'rgba(217,59,101,0.1)', border: '1px solid rgba(217,59,101,0.2)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#F9D0DA', marginBottom: '8px', fontWeight: 600 }}>Código da ordem</div>
                  <div style={{ fontWeight: 800, fontSize: '18px' }}>2E0Z8HK5</div>
              </div>
            </div>
        </div>
        
        {/* Right Dropoff info Panel */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#D9DCDF', color: 'var(--text-dark)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 16px 0' }}>Previsão de Retirada</h3>
            
            <div>
              <div style={{ fontSize: '14px', color: '#555', marginBottom: '8px', fontWeight: 600 }}>Data de retirada</div>
              {isEditingPickup ? (
                <input 
                  type="datetime-local" 
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', background: '#FFFFFF', color: '#333' }}
                />
              ) : (
                <div style={{ fontSize: '20px', fontWeight: 800 }}>
                  {new Date(pickupDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/^\w/, (c) => c.toUpperCase())}
                </div>
              )}
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: '14px', color: '#555', marginBottom: '8px', fontWeight: 600 }}>Observações</div>
              <textarea 
                readOnly={!isEditingPickup} 
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                placeholder={isEditingPickup ? "Insira as observações aqui..." : ""}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: isEditingPickup ? '2px solid #111' : '1px solid #ccc', background: isEditingPickup ? '#FFFFFF' : '#F8F9FA', color: '#333', resize: 'none', minHeight: '120px' }}>
              </textarea>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              {isEditingPickup ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => { setIsEditingPickup(false); setPickupDate(activeOrderJob?.pickupDate || pickupDate); setPickupNotes(activeOrderJob?.pickupNotes || pickupNotes); }} style={{ background: 'transparent', color: '#555', border: '1px solid #999', padding: '14px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={() => { 
                    setIsEditingPickup(false);
                    // Update all jobs for this customer with the new pickup details
                    const updatedJobs = jobs.map((j: any) => j.customerName === activeOrderJob.customerName ? { ...j, pickupDate, pickupNotes } : j);
                    setJobs(updatedJobs);
                  }} style={{ background: '#111', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '8px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>Salvar alterações</button>
                </div>
              ) : (
                <button onClick={() => setIsEditingPickup(true)} style={{ background: '#111', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '8px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>Editar</button>
              )}
            </div>
        </div>
      </div>

      {/* Rackets to string bottom table */}
      <div className="glass-panel" style={{ padding: '32px', background: 'white', color: 'var(--text-dark)', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Raquetes da ordem</h3>
            <button 
                onClick={() => {
                   const cust = customers?.find((c: any) => c.name === activeOrderJob.customerName);
                   if (cust) {
                      setSelectedCustomer(cust);
                   }
                   setNewJobStep(2);
                   setView('new_job');
                }}
                style={{ background: '#D93B65', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
                <Plus size={18} strokeWidth={3} /> Adicionar raquete
            </button>
          </div>
          
          {/* Table Header */}
          <div style={{ minWidth: '1000px', display: 'grid', gridTemplateColumns: 'minmax(220px, 1.5fr) 1fr 1fr 1fr 1fr 1fr 1fr 240px', fontSize: '14px', color: '#666', fontWeight: 700, paddingBottom: '16px', borderBottom: '1px solid #E5E7EB', marginBottom: '16px' }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>Raquete <span style={{fontSize: '10px', color: '#aaa'}}>▼</span></div>
            <div>Mains</div>
            <div>Crosses</div>
            <div>Status</div>
            <div>Encordoador</div>
            <div>Data do encord.</div>
            <div>Preço</div>
            <div style={{textAlign: 'center'}}>Ações</div>
          </div>
          
          {/* Table Rows corresponding to Order */}
          {jobs.filter((j: any) => j.customerName === activeOrderJob.customerName).map((orderJob: any) => (
            <div key={orderJob.id} style={{ minWidth: '1000px', display: 'grid', gridTemplateColumns: 'minmax(220px, 1.5fr) 1fr 1fr 1fr 1fr 1fr 1fr 240px', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid #F3F4F6' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '4px' }}>{orderJob.racketModel} <span style={{fontWeight: 600, color: '#888'}}>[1]</span></div>
                  <div style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>18x20 L3</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Solinco Hyper-G Green</div>
                  <div style={{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>@ {orderJob.tension || '52 lbs'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Solinco Hyper-G Green</div>
                  <div style={{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>@ {orderJob.tension || '52 lbs'}</div>
                </div>
                <div>
                  <div style={{ display: 'inline-block', background: '#F2C94C', color: 'var(--text-dark)', padding: '6px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 800 }}>
                    {orderJob.type === 'to_string' ? 'Para Encordoar' : orderJob.type === 'picking_up' ? 'Pronto' : 'Aguardando'}
                  </div>
                </div>
                <div></div>
                <div></div>
                <div style={{ fontWeight: 900, fontSize: '16px' }}>{orderJob.price ? orderJob.price.toFixed(2) : '120.00'} BRL</div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <button onClick={() => { setActivePaymentJob(orderJob); setIsPaymentModalOpen(true); }} style={{ background: orderJob.paid ? '#6FCF97' : '#D93B65', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Pagamento"><DollarSign size={16} strokeWidth={3} /></button>
                  <button onClick={() => { import('../utils/printUtils').then(m => m.printLabel(orderJob, 'heart')); }} style={{ background: '#E5E7EB', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Imprimir Etiqueta Coração"><Ticket size={16} strokeWidth={3} /></button>
                  <button onClick={() => { import('../utils/printUtils').then(m => m.printLabel(orderJob, 'full')); }} style={{ background: '#E5E7EB', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Imprimir Etiqueta"><Printer size={16} strokeWidth={3} /></button>
                  <button onClick={() => setJobs(jobs.filter((j: any) => j.id !== orderJob.id))} style={{ background: '#FCA5A5', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: '#B42D2D', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Excluir"><Trash2 size={16} strokeWidth={3} /></button>
                  <button onClick={() => { const cust = customers?.find((c: any) => c.name === orderJob.customerName); if (cust) setSelectedCustomer(cust); setNewJobStep(2); setView('new_job'); }} style={{ background: '#4298E7', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Editar"><Edit size={16} strokeWidth={3} /></button>
                  <button onClick={() => { setActiveStringingJob(orderJob); setView('stringing'); }} style={{ background: '#F2C94C', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Painel de Encordoamento"><Grid size={16} strokeWidth={3} /></button>
                </div>
            </div>
          ))}

          {/* Table Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 0 8px 0', alignItems: 'flex-start', borderTop: '1px solid #E5E7EB', marginTop: '16px' }}>
            <div style={{ fontSize: '15px', color: '#666', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                Show <select style={{padding: '4px', borderRadius: '4px', border: '1px solid #ccc'}}><option>10</option></select> entries
              </div>
              <span>Mostrando 1 a {jobs.filter((j: any) => j.customerName === activeOrderJob.customerName).length} de {jobs.filter((j: any) => j.customerName === activeOrderJob.customerName).length} registros</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900 }}>{jobs.filter((j: any) => j.customerName === activeOrderJob.customerName).reduce((acc: number, curr: any) => acc + (curr.price || 120), 0).toFixed(2)} BRL</div>
                </div>
            </div>
          </div>

      </div>
    </motion.div>
  );
};
