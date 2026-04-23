import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const OrdersFilterModal = ({ isOpen, onClose, onApply }: any) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%', maxWidth: '500px', background: 'white',
          borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#111827' }}>Filtros</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '8px' }}>Status</label>
              <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', fontSize: '15px' }}>
                <option>Todos</option>
                <option>Para Encordoar</option>
                <option>Pronto / Para Entrega</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '8px' }}>Pago</label>
              <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', fontSize: '15px' }}>
                <option>Não</option>
                <option>Sim</option>
                <option>Todos</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '8px' }}>Diferença em dias da data de retirada desejada vs real</label>
              <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', fontSize: '15px' }}>
                <option>---</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '8px' }}>Clube de origem</label>
              <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', fontSize: '15px' }}>
                <option>---</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '8px' }}>Professor</label>
              <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', fontSize: '15px' }}>
                <option>---</option>
              </select>
            </div>

          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '24px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
          <button onClick={onClose} style={{ background: '#E5E7EB', color: '#374151', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
            Fechar
          </button>
          <button onClick={() => { if(onApply) onApply(); onClose(); }} style={{ background: '#4298E7', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
            Aplicar
          </button>
        </div>

      </motion.div>
    </div>
  );
};
