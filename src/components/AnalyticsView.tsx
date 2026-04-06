import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download } from 'lucide-react';

export const AnalyticsView = ({ jobs }: any) => {
  const [activeTab, setActiveTab] = useState('overview');

  const metricBoxStyle = (bg: string) => ({
    background: bg,
    padding: '24px',
    borderRadius: '8px',
    color: 'white',
    flex: 1,
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center'
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
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6136B3', color: 'white', padding: '10px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
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
             <div style={metricBoxStyle('#F2C94C')}>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>{jobs?.length || 0}</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Encordoamentos</div>
             </div>
             <div style={metricBoxStyle('#EB5757')}>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>0</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Ordens</div>
             </div>
             <div style={metricBoxStyle('#6FCF97')}>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>0.00 BRL</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Ganhos</div>
             </div>
          </div>

          <div style={panelStyle}>
            <div style={{ width: '100%', height: '200px', background: '#F9FAFB', border: '1px dashed #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Gráfico de linha (Placeholder)</div>
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
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6136B3', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
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

    </motion.div>
  );
};
