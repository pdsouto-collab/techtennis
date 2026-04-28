import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, FileText, FileJson, Plus, Filter, Trash2, Edit, DollarSign, Truck } from 'lucide-react';
import { OrdersFilterModal } from './OrdersFilterModal';

export const OrdersView = ({ onAddOrder, jobs, customers, professors, onDeleteOrder, onEditOrder, onPayment, onDelivery, onViewOrder }: any) => {
  const [activeTab, setActiveTab] = useState('unpaid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const panelStyle = {
    background: 'var(--bg-panel)',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  const rawOrders = Object.values((jobs || []).reduce((acc: any, job: any) => {
    const code = job.orderCode || job.id.substring(0,8).toUpperCase();
    if (!acc[code]) {
      acc[code] = {
        id: code,
        orderCode: code,
        customerName: job.customerName,
        date: job.date,
        pickupDate: job.pickupDate,
        type: job.type,
        status: job.status,
        paid: job.paid,
        price: job.price || 120,
        racketsCount: 0,
        commissionedProfessorId: job.commissionedProfessorId,
        updatedAt: job.updatedAt
      };
    }
    acc[code].racketsCount += 1;
    if (acc[code].racketsCount === 1) {
      acc[code].price = (job.price || 120);
    } else {
      acc[code].price += (job.price || 120);
    }
    if (job.commissionedProfessorId) acc[code].commissionedProfessorId = job.commissionedProfessorId;
    if (job.updatedAt && (!acc[code].updatedAt || new Date(job.updatedAt) > new Date(acc[code].updatedAt))) acc[code].updatedAt = job.updatedAt;
    // Assume if one is unpaid, order is unpaid
    if (!job.paid) acc[code].paid = false;
    return acc;
  }, {})).reverse().filter((order: any) => {
    if (activeTab === 'unpaid' && order.paid) return false;
    if (statusFilter !== 'all' && order.type !== statusFilter) return false;
    return true;
  });

  const exportData = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'pdf') {
      window.print();
      return;
    }
    
    // For CSV/Excel, build a simple CSV string
    const headers = ['Nome', 'Data', 'Previsão de Retirada', 'Ordem', 'Preço', 'Status', 'Pago'];
    const rows = rawOrders.map((o: any) => [
      o.customerName,
      o.date,
      o.pickupDate ? new Date(o.pickupDate).toLocaleString('pt-BR') : '---',
      o.orderCode,
      o.price.toFixed(2),
      o.type === 'picked_up' ? 'Entregue' : o.type === 'picking_up' ? 'Pronta' : o.type === 'to_string' ? 'Para Encordoar' : 'Aguardando',
      o.paid ? 'Pago' : 'Não pago'
    ]);
    
    const csvContent = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    let mimeType = 'text/csv';
    let ext = '.csv';
    
    if (format === 'excel') {
      mimeType = 'application/vnd.ms-excel';
      ext = '.xls';
    }
    
    const blob = new Blob(['\ufeff' + csvContent], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ordens_${new Date().toISOString().split('T')[0]}${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayedOrders = rawOrders.map((order: any) => {
    const cust = (customers || []).find((c: any) => c.name === order.customerName);
    
    return (
      <tr key={order.id}>
          <td style={{ padding: '16px', fontSize: '14px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{order.customerName}</td>
          <td style={{ padding: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{cust?.numericId || '---'}</td>
          <td style={{ padding: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{order.date}</td>
          <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ padding: '4px 12px', borderRadius: '4px', background: order.type === 'picked_up' ? '#4298E7' : order.type === 'picking_up' ? '#6FCF97' : '#F2C94C', color: order.type === 'picking_up' ? 'var(--text-dark)' : 'white', fontWeight: 600, fontSize: '12px' }}>
                  {order.type === 'picked_up' ? 'Entregue' : order.type === 'picking_up' ? 'Pronta' : order.type === 'to_string' ? 'Para Encordoar' : 'Aguardando'}
              </span>
          </td>
          <td style={{ padding: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{order.pickupDate ? new Date(order.pickupDate).toLocaleString('pt-BR') : '---'}</td>
          <td style={{ padding: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{order.type === 'picked_up' && order.updatedAt ? new Date(order.updatedAt).toLocaleString('pt-BR') : '---'}</td>
          <td style={{ padding: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{cust?.originClub || 'Não informado'}</td>
          <td style={{ padding: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{professors?.find((p: any) => p.id === order.commissionedProfessorId)?.name || '---'}</td>
          <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontWeight: 700, color: 'white' }}>{order.orderCode}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Raquetes: {order.racketsCount}</div>
          </td>
          <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontWeight: 700, color: 'white' }}>BRL {order.price.toFixed(2)}</div>
              <div style={{ color: order.paid ? '#6FCF97' : '#EB5757', fontSize: '12px', fontWeight: 600 }}>{order.paid ? 'Pago' : 'Não pago'}</div>
          </td>
          <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', height: '100%' }}>
                <button onClick={() => onViewOrder?.(order.orderCode)} style={{ background: '#C25488', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }} title="Detalhes da Ordem"><FileText size={16} /></button>
                <button onClick={() => onDeleteOrder?.(order.orderCode)} style={{ background: '#EB5757', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }} title="Deletar"><Trash2 size={16} /></button>
                <button onClick={() => onEditOrder?.(order.orderCode)} style={{ background: '#4298E7', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }} title="Editar"><Edit size={16} /></button>
                <button onClick={() => onPayment?.(order.orderCode)} style={{ background: '#D93B65', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }} title="Pagamento"><DollarSign size={16} /></button>
                {order.type === 'picking_up' && (
                  <button onClick={() => onDelivery?.(order.orderCode)} style={{ background: '#1A202C', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }} title="Entregar"><Truck size={16} /></button>
                )}
              </div>
          </td>
      </tr>
    )
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'transparent', fontSize: '18px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}>
                <option value="all" style={{color: 'black'}}>Todos</option>
                <option value="to_string" style={{color: 'black'}}>Para encordoar</option>
                <option value="picking_up" style={{color: 'black'}}>Pronta</option>
                <option value="picked_up" style={{color: 'black'}}>Entregue</option>
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
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
        <button onClick={() => setActiveTab('unpaid')} style={{ background: 'none', border: 'none', color: activeTab === 'unpaid' ? '#F2C94C' : 'white', fontWeight: activeTab === 'unpaid' ? 700 : 500, fontSize: '16px', cursor: 'pointer' }}>Ordens não Pagas</button>
        <button onClick={() => setActiveTab('all')} style={{ background: 'none', border: 'none', color: activeTab === 'all' ? '#F2C94C' : 'white', fontWeight: activeTab === 'all' ? 700 : 500, fontSize: '16px', cursor: 'pointer' }}>Todas as Ordens</button>
      </div>

      <div style={{ ...panelStyle, padding: 0, overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
                <button onClick={() => exportData('excel')} style={{ background: '#6FCF97', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '4px 0 0 4px', cursor: 'pointer' }} title="Gerar Excel"><FileSpreadsheet size={18} /></button>
                <button onClick={() => exportData('pdf')} style={{ background: '#D93B65', border: 'none', color: 'white', padding: '8px 12px', cursor: 'pointer' }} title="Gerar PDF"><FileText size={18} /></button>
                <button onClick={() => exportData('csv')} style={{ background: '#F2C94C', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '0 4px 4px 0', cursor: 'pointer' }} title="Gerar CSV"><FileJson size={18} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                  <option value="all" style={{color: 'black'}}>Todos</option>
                  <option value="to_string" style={{color: 'black'}}>Para encordoar</option>
                  <option value="picking_up" style={{color: 'black'}}>Pronta</option>
                  <option value="picked_up" style={{color: 'black'}}>Entregue</option>
                </select>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginLeft: '8px' }}>Pesquisar:</span>
                <input type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <tr>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white' }}>Cliente</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white' }}>ID TechTennis</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>Inserção</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white' }}>Status</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>Previsão Retirada</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>Retirada Real</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white' }}>Clube</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white' }}>Professor</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white' }}>Ordem</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white' }}>Preço</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'white' }}></th>
                </tr>
            </thead>
            <tbody>
                {displayedOrders.length > 0 ? displayedOrders : (
                  <tr><td colSpan={11} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Nenhuma ordem encontrada</td></tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Pagination controls */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Mostrar
              <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <option>10</option>
              </select>
              registros
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div>Mostrando 1 a {displayedOrders.length} de {displayedOrders.length} registros</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontWeight: 600, cursor: 'not-allowed' }}>Anterior</button>
                <button style={{ background: '#4298E7', border: 'none', color: 'white', padding: '4px 12px', borderRadius: '4px', fontWeight: 600 }}>1</button>
                <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontWeight: 600, cursor: 'not-allowed' }}>Próximo</button>
              </div>
            </div>
        </div>

      </div>
      
      <OrdersFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={() => setIsFilterModalOpen(false)} />
    </motion.div>
  );
};
