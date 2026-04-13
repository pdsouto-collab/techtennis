import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download, X } from 'lucide-react';
import { PeriodModal } from './PeriodModal';

export const AnalyticsView = ({ jobs, appSettings }: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [detailModalContent, setDetailModalContent] = useState<'encordoamentos' | 'ordens' | 'ganhos' | null>(null);
  const [chartMetric, setChartMetric] = useState<'ordens'|'encordoamentos'|'ganhos'>('ordens');
  const [chartPeriod, setChartPeriod] = useState<'dia'|'semana'|'mes'>('mes');

  // Computed data
  const ordersCount = new Set(jobs.map((j: any) => j.orderCode).filter(Boolean)).size || 0;
  const totalEarnings = jobs.reduce((acc: number, j: any) => acc + (j.price || 0), 0);
  const pickupPoints = appSettings?.pickupPoints || ['Test', 'Loja 1'];

  const chartData = useMemo(() => {
    const grouped: any = {};
    jobs.forEach((j: any) => {
       const key = j.date?.split('T')[0] || 'unknown'; // Grouping arbitrarily by date string
       if (!grouped[key]) grouped[key] = { ordens: new Set(), encord: 0, ganhos: 0 };
       if (j.orderCode) grouped[key].ordens.add(j.orderCode);
       grouped[key].encord += 1;
       grouped[key].ganhos += j.price || 0;
    });

    const dates = Object.keys(grouped).sort();
    let dataPoints = [0, 0, 0, 0, 0, 0];

    if (dates.length > 0) {
      dataPoints = dates.map(d => {
         if (chartMetric === 'ordens') return grouped[d].ordens.size;
         if (chartMetric === 'encordoamentos') return grouped[d].encord;
         return grouped[d].ganhos;
      });
    }

    while (dataPoints.length < 6) dataPoints.unshift(0);
    dataPoints = dataPoints.slice(-6); // last 6 points

    let maxVal = Math.max(...dataPoints);
    if (maxVal < 4 && chartMetric !== 'ganhos') maxVal = 4;
    if (maxVal === 0) maxVal = 4; // fallback scale

    const width = 100;
    const path = dataPoints.map((val, idx) => {
       const x = (idx / (dataPoints.length - 1)) * width;
       const y = 90 - (val / maxVal) * 80; 
       return `${idx === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    
    return { path, maxVal, dataPoints };
  }, [jobs, chartMetric, chartPeriod]);

  const metricBoxStyle = (bg: string) => ({
    background: bg,
    padding: '24px',
    borderRadius: '8px',
    color: 'white',
    flex: 1,
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    cursor: 'pointer'
  });

  const panelStyle = {
    background: 'var(--bg-panel)',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Analytics (Últimos 7 dias)</h2>
        <button onClick={() => setIsPeriodModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6136B3', color: 'white', padding: '10px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          <Calendar size={18} /> Período
        </button>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
        <button onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', color: activeTab === 'overview' ? '#6136B3' : 'var(--text-secondary)', fontWeight: activeTab === 'overview' ? 700 : 500, fontSize: '16px', cursor: 'pointer' }}>Visão Geral</button>
        <button onClick={() => setActiveTab('stringings')} style={{ background: 'none', border: 'none', color: activeTab === 'stringings' ? '#6136B3' : 'var(--text-secondary)', fontWeight: activeTab === 'stringings' ? 700 : 500, fontSize: '16px', cursor: 'pointer' }}>Encordoamentos</button>
      </div>

      {/* Dashboard View */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top 3 KPI */}
          <div style={{ display: 'flex', gap: '24px' }}>
             <div style={metricBoxStyle('#F2C94C')} onClick={() => setDetailModalContent('encordoamentos')}>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>{jobs?.length || 0}</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Encordoamentos</div>
             </div>
             <div style={metricBoxStyle('#EB5757')} onClick={() => setDetailModalContent('ordens')}>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>{ordersCount}</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Ordens</div>
             </div>
             <div style={metricBoxStyle('#6FCF97')} onClick={() => setDetailModalContent('ganhos')}>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>{totalEarnings.toFixed(2)} BRL</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Ganhos</div>
             </div>
          </div>

          <div style={{ ...panelStyle, padding: '16px 24px', display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
            {/* Chart Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <select 
                  value={chartMetric} 
                  onChange={(e) => setChartMetric(e.target.value as any)}
                  style={{ border: 'none', background: 'transparent', fontSize: '15px', fontWeight: 700, color: '#111827', cursor: 'pointer', outline: 'none', appearance: 'none', paddingRight: '20px', fontFamily: 'inherit' }}>
                  <option value="ordens">Ordens</option>
                  <option value="encordoamentos">Encordoamentos</option>
                  <option value="ganhos">Ganhos</option>
                </select>
                <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setChartPeriod('dia')} style={{ background: chartPeriod === 'dia' ? '#4298E7' : 'transparent', color: chartPeriod === 'dia' ? 'white' : '#4298E7', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Dia</button>
                <button onClick={() => setChartPeriod('semana')} style={{ background: chartPeriod === 'semana' ? '#4298E7' : 'transparent', color: chartPeriod === 'semana' ? 'white' : '#4298E7', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Semana</button>
                <button onClick={() => setChartPeriod('mes')} style={{ background: chartPeriod === 'mes' ? '#4298E7' : 'transparent', color: chartPeriod === 'mes' ? 'white' : '#4298E7', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Mês</button>
              </div>
            </div>

            {/* Chart Body */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: '16px' }}>
               {[chartData.maxVal, chartData.maxVal * 0.75, chartData.maxVal * 0.5, chartData.maxVal * 0.25, 0].map((val, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%', height: '40px' }}>
                     <span style={{ width: '40px', fontSize: '12px', color: '#9CA3AF', textAlign: 'right', paddingRight: '12px' }}>
                       {chartMetric === 'ganhos' ? val.toFixed(0) : Math.round(val)}
                     </span>
                     <div style={{ flex: 1, borderTop: '1px solid #F3F4F6' }}></div>
                  </div>
               ))}
               
               {/* Animated svg line chart */}
               <svg style={{ position: 'absolute', top: 0, left: '40px', right: 0, bottom: '20px', width: 'calc(100% - 40px)', height: '100%', pointerEvents: 'none', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                     <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#86E09C" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#86E09C" stopOpacity="0" />
                     </linearGradient>
                  </defs>
                  
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }} 
                    animate={{ pathLength: 1, opacity: 1 }} 
                    transition={{ duration: 1, ease: 'easeOut' }}
                    d={chartData.path} fill="none" stroke="#86E09C" strokeWidth="3.5" strokeLinejoin="round" 
                  />
                  <motion.path 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 1, delay: 0.5 }}
                    d={`${chartData.path} L100,100 L0,100 Z`} fill="url(#gradient)" 
                  />
               </svg>
            </div>
          </div>

          {/* 4 Small Metrics */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{...metricBoxStyle('#4298E7'), minHeight: '80px', padding: '16px'}}>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>0.00 m</div>
              <div style={{ fontSize: '13px' }}>Metros de corda usados</div>
            </div>
            <div style={{...metricBoxStyle('#9B51E0'), minHeight: '80px', padding: '16px'}}>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>0.00 Kg</div>
              <div style={{ fontSize: '13px' }}>Tensão média</div>
            </div>
            <div style={{...metricBoxStyle('#EB5757'), minHeight: '80px', padding: '16px'}}>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>0.00 Kg</div>
              <div style={{ fontSize: '13px' }}>Maior tensão</div>
            </div>
            <div style={{...metricBoxStyle('#6FCF97'), minHeight: '80px', padding: '16px'}}>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>0.00 Kg</div>
              <div style={{ fontSize: '13px' }}>Menor tensão</div>
            </div>
          </div>

          {/* Pie Charts Row 1 */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{...panelStyle, flex: 1.5}}>
              <h3>Centros de custo</h3>
              <div style={{ height: '150px', background: '#F9FAFB', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Gráfico Rosca</div>
            </div>
            <div style={{...panelStyle, flex: 1}}>
              <h3>Encordoamentos por gênero</h3>
              <div style={{ height: '150px', background: '#F9FAFB', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Gráfico Rosca</div>
            </div>
          </div>

          {/* Pie Charts Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            <div style={panelStyle}>
              <h3>Tipos de cordas</h3>
              <div style={{ height: '200px', background: '#F9FAFB', marginTop: '16px' }} />
            </div>
            <div style={panelStyle}>
              <h3>Marcas mais usadas (corda)</h3>
              <div style={{ height: '200px', background: '#F9FAFB', marginTop: '16px' }} />
            </div>
            <div style={panelStyle}>
              <h3>Marcas mais usadas (raquete)</h3>
              <div style={{ height: '200px', background: '#F9FAFB', marginTop: '16px' }} />
            </div>
          </div>

          {/* Top Models and Stringers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{...panelStyle, background: 'rgba(66, 152, 231, 0.1)'}}>
              <h3>Modelos mais usados (corda)</h3>
              <div style={{ marginTop: '16px', color: '#4298E7', fontWeight: 600 }}>Nenhum dado</div>
            </div>
            <div style={{...panelStyle, background: 'rgba(155, 81, 224, 0.1)'}}>
              <h3>Modelos mais usados (raquete)</h3>
              <div style={{ marginTop: '16px', color: '#9B51E0', fontWeight: 600 }}>Nenhum dado</div>
            </div>
          </div>

          {/* Ranking Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            <div style={{...panelStyle, background: 'rgba(66, 152, 231, 0.1)'}}>
              <h4>Por encordoador</h4>
            </div>
            <div style={{...panelStyle, background: 'rgba(0, 0, 0, 0.05)'}}>
              <h4>Por professor</h4>
            </div>
            <div style={{...panelStyle, background: 'rgba(0, 0, 0, 0.02)'}}>
              <h4>Por clube</h4>
            </div>
          </div>

          {/* Top Customers Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            <div style={{...panelStyle, background: 'rgba(242, 201, 76, 0.1)'}}>
              <h4>Top clientes (encordoamentos)</h4>
            </div>
            <div style={{...panelStyle, background: 'rgba(235, 87, 87, 0.1)'}}>
              <h4>Top clientes (ordens)</h4>
            </div>
            <div style={{...panelStyle, background: 'rgba(111, 207, 151, 0.1)'}}>
              <h4>Top clientes (ganhos)</h4>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stringings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Raquetes encordoadas (Hoje)</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4298E7', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                <Filter size={16} /> Filtros
              </button>
              <button onClick={() => setIsPeriodModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6136B3', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                <Calendar size={16} /> Período
              </button>
            </div>
          </div>

          <div style={{ ...panelStyle, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6FCF97', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                <Download size={16} /> Exportar
              </button>
              <input type="text" placeholder="Pesquisar..." style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#F9FAFB' }}>
                  <tr>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Cliente</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Data</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Raquete</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Mains</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Crosses</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>HZ</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>DT</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>CH</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Clube</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Professor</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Encordoador</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Máquina</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Preço</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Horas de jogo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={14} style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
                      Nenhum dado disponível na tabela
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '14px' }}>
              <div>Mostrando 0 a 0 de 0 registros</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontWeight: 600 }}>Anterior</button>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontWeight: 600 }}>Próximo</button>
              </div>
            </div>
          </div>

        </div>
      )}

    <PeriodModal isOpen={isPeriodModalOpen} onClose={() => setIsPeriodModalOpen(false)} onApply={(dates: any) => { console.log('Period selected:', dates); setIsPeriodModalOpen(false); }} />
    
    {detailModalContent && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, color: '#333' }}>
        <div style={{ background: 'white', width: '80%', maxWidth: '900px', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#111827' }}>
              {detailModalContent === 'encordoamentos' ? 'Encordoamentos' : detailModalContent === 'ordens' ? 'Ordens' : 'Ganhos'}
            </h2>
            <button onClick={() => setDetailModalContent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} color="#6B7280" /></button>
          </div>
          
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#F9FAFB', fontWeight: 600, color: '#374151', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ flex: 1 }}>Ponto de encordoamento</div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                {detailModalContent === 'encordoamentos' ? 'Encordoamentos' : detailModalContent === 'ordens' ? 'Ordens' : 'Ganhos'}
              </div>
            </div>
            
            {pickupPoints.map((point: string, idx: number) => {
              // for now, we just divide the values proportionally or show full values as placeholder
              // since stringingPoint is not strictly recorded on jobs yet
              const pointValue = detailModalContent === 'encordoamentos' 
                ? (idx === 0 ? jobs.length : 0) // mockup: all goes to first point
                : detailModalContent === 'ordens' 
                ? (idx === 0 ? ordersCount : 0)
                : `${(idx === 0 ? totalEarnings : 0).toFixed(2)} BRL`;

              return (
                <div key={point} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', fontSize: '14px', color: '#6B7280', background: 'white', borderBottom: idx < pickupPoints.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                   <div style={{ flex: 1 }}>{point}</div>
                   <div style={{ flex: 1, textAlign: 'right', fontWeight: 600 }}>
                     {pointValue}
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}

    </motion.div>
  );
};
