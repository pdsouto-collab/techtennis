import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const PrepaidListModal = ({ isOpen, onClose, prepaids = [], stringingPoint = 'N/A' }: any) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1100,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%', maxWidth: '800px', background: 'white',
          borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#111827' }}>Pré-pago</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '16px' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <tr>
                  <th style={{ padding: '16px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>Ponto de encordoamento</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>Nº encordoamentos</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>Nº restantes</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>Valor</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {prepaids.length > 0 ? prepaids.map((p: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{stringingPoint}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{p.numStringings}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{p.numStringings}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{parseFloat(p.amount).toFixed(2)}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '14px', background: '#F9FAFB' }}>
                      Nenhum dado disponível na tabela
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Mostrar 
              <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                <option>10</option>
              </select>
              registros
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#9CA3AF' }}>
              <span>Anterior</span>
              <span>Próximo</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '16px' }}>
            Mostrando 0 a 0 de 0 registros
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', background: '#F9FAFB' }}>
            <button onClick={onClose} style={{ background: '#E5E7EB', color: '#374151', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
              Fechar
            </button>
        </div>
      </motion.div>
    </div>
  );
};
