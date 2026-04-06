import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, FileText, FileJson, Plus, Filter, Trash2, Edit, DollarSign } from 'lucide-react';
import { OrdersFilterModal } from './OrdersFilterModal';

export const OrdersView = ({ onAddOrder }: any) => {
  const [activeTab, setActiveTab] = useState('unpaid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <select style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'transparent', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}>
                <option>Todos</option>
            </select>
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
               {activeTab === 'unpaid' ? 'Ordens não Pagas' : 'Todas as Ordens'}
            </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onAddOrder} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#D93B65', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={16} /> Adicionar ordem
          </button>
          <button onClick={() => setIsFilterModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4298E7', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            <Filter size={16} /> Filtros
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
        <button onClick={() => setActiveTab('unpaid')} style={{ background: 'none', border: 'none', color: activeTab === 'unpaid' ? '#6136B3' : 'var(--text-secondary)', fontWeight: activeTab === 'unpaid' ? 700 : 500, fontSize: '16px', cursor: 'pointer' }}>Ordens não Pagas</button>
        <button onClick={() => setActiveTab('all')} style={{ background: 'none', border: 'none', color: activeTab === 'all' ? '#6136B3' : 'var(--text-secondary)', fontWeight: activeTab === 'all' ? 700 : 500, fontSize: '16px', cursor: 'pointer' }}>Todas as Ordens</button>
      </div>

      <div style={{ ...panelStyle, padding: 0, overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
                <button style={{ background: '#6FCF97', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '4px 0 0 4px', cursor: 'pointer' }}><FileSpreadsheet size={18} /></button>
                <button style={{ background: '#D93B65', border: 'none', color: 'white', padding: '8px 12px', cursor: 'pointer' }}><FileText size={18} /></button>
                <button style={{ background: '#F2C94C', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}><FileJson size={18} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Pesquisar:</span>
                <input type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#F9FAFB' }} />
            </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>
                <tr>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Name</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Data de inserção</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Status v</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Data de retirada desejada</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Data de retirada</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Clube</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Professor</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Ordem</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Preço</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}></th>
                </tr>
            </thead>
            <tbody>
                {/* Example row based on mockups */}
                <tr>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Souto Paulo</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>04/04/2026 14:13</td>
                    <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '4px', background: '#F2C94C', color: 'white', fontWeight: 600, fontSize: '12px' }}>Para Encordoar</span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>04/04/2026 12:30</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>---</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Gênesis 2</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}></td>
                    <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>
                        <div style={{ fontWeight: 700, color: '#374151' }}>SS2Z8HK5</div>
                        <div style={{ color: '#6B7280', fontSize: '12px' }}>Raquetas: 1</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>
                        <div style={{ fontWeight: 700, color: '#374151' }}>BRL 120.00</div>
                        <div style={{ color: '#EB5757', fontSize: '12px', fontWeight: 600 }}>Não pago</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: '4px', justifyContent: 'flex-end', height: '100%' }}>
                        <button style={{ background: '#EB5757', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        <button style={{ background: '#4298E7', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Edit size={16} /></button>
                        <button style={{ background: '#D93B65', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><DollarSign size={16} /></button>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>

        {/* Pagination controls */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6B7280', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Mostrar
              <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #D1D5DB', background: '#F9FAFB' }}>
                <option>10</option>
              </select>
              registros
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div>Mostrando 1 a 1 de 1 registros</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontWeight: 600, cursor: 'not-allowed' }}>Anterior</button>
                <button style={{ background: '#4298E7', border: 'none', color: 'white', padding: '4px 12px', borderRadius: '4px', fontWeight: 600 }}>1</button>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontWeight: 600, cursor: 'not-allowed' }}>Próximo</button>
              </div>
            </div>
        </div>

      </div>
      
      <OrdersFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={() => setIsFilterModalOpen(false)} />
    </motion.div>
  );
};
