import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Edit } from 'lucide-react';

export const SettingsView = ({ settings, setSettings }: any) => {
  const [activeTab, setActiveTab] = useState<'strings' | 'pickupPoints' | 'machines' | 'stringers' | 'sports' | 'commissions' | 'clubDiscounts'>('strings');
  
  const [newItemText, setNewItemText] = useState('');
  const [newCommissionPercent, setNewCommissionPercent] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItemText, setEditItemText] = useState('');
  const [editCommissionPercent, setEditCommissionPercent] = useState('');
  const [newStringPrice, setNewStringPrice] = useState('');
  const [editStringPrice, setEditStringPrice] = useState('');

  const [newClub, setNewClub] = useState('');
  const [newDiscountService, setNewDiscountService] = useState('');
  const [newDiscountPercent, setNewDiscountPercent] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  const [editClub, setEditClub] = useState('');
  const [editDiscountService, setEditDiscountService] = useState('');
  const [editDiscountPercent, setEditDiscountPercent] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  const customers = JSON.parse(localStorage.getItem('tt_customers') || '[]');
  const uniqueClubs = Array.from(new Set(customers.map((c: any) => c.originClub?.trim()).filter(Boolean)));

  const currentList = settings[activeTab] || [];

  const handleAdd = () => {
    let value: any = newItemText.trim();
    if (activeTab === 'commissions') {
      if (!newItemText.trim()) return;
      value = { name: newItemText.trim(), percent: Number(newCommissionPercent) || 0 };
    } else if (activeTab === 'strings') {
      if (!newItemText.trim()) return;
      value = { name: newItemText.trim(), price: Number(newStringPrice) || 0 };
    } else if (activeTab === 'clubDiscounts') {
      if (!newClub || !newDiscountService || !newDiscountPercent) return;
      value = { club: newClub, service: newDiscountService, percent: Number(newDiscountPercent), startDate: newStartDate, endDate: newEndDate };
    } else {
      if (!newItemText.trim()) return;
    }

    setSettings((prev: any) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), value]
    }));
    setNewItemText('');
    setNewCommissionPercent('');
    setNewStringPrice('');
    setNewClub('');
    setNewDiscountService('');
    setNewDiscountPercent('');
    setNewStartDate('');
    setNewEndDate('');
  };

  const handleDelete = (index: number) => {
    setSettings((prev: any) => {
      const newList = [...(prev[activeTab] || [])];
      newList.splice(index, 1);
      return { ...prev, [activeTab]: newList };
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    if (activeTab === 'commissions') {
      setEditItemText(currentList[index].name);
      setEditCommissionPercent(currentList[index].percent.toString());
    } else if (activeTab === 'strings') {
      const str = currentList[index];
      if (typeof str === 'string') {
        setEditItemText(str);
        setEditStringPrice('0');
      } else {
        setEditItemText(str.name);
        setEditStringPrice(str.price.toString());
      }
    } else if (activeTab === 'clubDiscounts') {
      setEditClub(currentList[index].club);
      setEditDiscountService(currentList[index].service);
      setEditDiscountPercent(currentList[index].percent.toString());
      setEditStartDate(currentList[index].startDate || '');
      setEditEndDate(currentList[index].endDate || '');
    } else {
      setEditItemText(currentList[index]);
    }
  };

  const saveEdit = (index: number) => {
    setSettings((prev: any) => {
      const newList = [...(prev[activeTab] || [])];
      if (activeTab === 'commissions') {
         if (!editItemText.trim()) return prev;
         newList[index] = { name: editItemText.trim(), percent: Number(editCommissionPercent) || 0 };
      } else if (activeTab === 'strings') {
         if (!editItemText.trim()) return prev;
         newList[index] = { name: editItemText.trim(), price: Number(editStringPrice) || 0 };
      } else if (activeTab === 'clubDiscounts') {
         if (!editClub.trim() || !editDiscountService || !editDiscountPercent) return prev;
         newList[index] = { club: editClub.trim(), service: editDiscountService, percent: Number(editDiscountPercent), startDate: editStartDate, endDate: editEndDate };
      } else {
         if (!editItemText.trim()) return prev;
         newList[index] = editItemText.trim();
      }
      return { ...prev, [activeTab]: newList };
    });
    setEditingIndex(null);
  };

  const tabs = [
    { id: 'strings', label: 'Corda (Main/Cross)' },
    { id: 'pickupPoints', label: 'Ponto de Encordoamento' },
    { id: 'machines', label: 'Máquina de Encordoamento' },
    { id: 'stringers', label: 'Encordoador' },
    { id: 'sports', label: 'Esporte' },
    { id: 'commissions', label: 'Comissão Professor (%)' },
    { id: 'clubDiscounts', label: 'Desconto por Clube (%)' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px' }}>
      
      {/* Sidebar / Tabs */}
      <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '20px' }}>Configurações</h2>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setEditingIndex(null); setNewItemText(''); }}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.id ? 'var(--text-dark)' : 'white',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '24px' }}>
          Gerenciar: {tabs.find(t => t.id === activeTab)?.label}
        </h3>

        {/* Add New */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {activeTab === 'clubDiscounts' ? (
            <>
              <select value={newClub} onChange={(e) => setNewClub(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                 <option value="" disabled style={{ color: 'rgba(255,255,255,0.6)' }}>Selecione o clube...</option>
                 {(uniqueClubs as string[]).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={newDiscountService} onChange={(e) => setNewDiscountService(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                 <option value="" disabled style={{ color: 'rgba(255,255,255,0.6)' }}>Selecione o serviço...</option>
                 <option value="Todos">Todos os serviços</option>
                 <option value="Encordoamento">Encordoamento</option>
                 <option value="Trocar grip base">Trocar grip base</option>
                 <option value="Trocar overgrip">Trocar overgrip</option>
                 <option value="Serviço customizado">Serviço customizado</option>
                 <option value="Compra de raquete nova">Compra de raquete nova</option>
                 <option value="Outros serviços">Outros serviços</option>
              </select>
              <input type="number" value={newDiscountPercent} onChange={(e) => setNewDiscountPercent(e.target.value)} placeholder="Desc. %" style={{ width: '90px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} style={{ width: '130px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgb(148, 163, 184)' }} title="Data Início" />
                <span style={{ color: 'white' }}>-</span>
                <input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} style={{ width: '130px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgb(148, 163, 184)' }} title="Data Fim" />
              </div>
            </>
          ) : activeTab === 'commissions' ? (
            <select
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
            >
              <option value="" disabled style={{ color: 'rgba(255,255,255,0.6)' }}>Selecione o serviço...</option>
              <option value="Encordoamento">Encordoamento</option>
              <option value="Trocar grip base">Trocar grip base</option>
              <option value="Trocar overgrip">Trocar overgrip</option>
              <option value="Serviço customizado">Serviço customizado</option>
              <option value="Compra de raquete nova">Compra de raquete nova</option>
              <option value="Outros serviços">Outros serviços</option>
            </select>
          ) : (
            <input 
              type="text" 
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={`Adicionar novo ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
            />
          )}

          {activeTab === 'commissions' && (
            <input 
              type="number" 
              value={newCommissionPercent}
              onChange={(e) => setNewCommissionPercent(e.target.value)}
              placeholder="Percentual (%)"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={{ width: '120px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
            />
          )}
          {activeTab === 'strings' && (
            <input 
              type="number" 
              value={newStringPrice}
              onChange={(e) => setNewStringPrice(e.target.value)}
              placeholder="Preço (BRL)"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={{ width: '120px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
            />
          )}
          <button onClick={handleAdd} style={{ padding: '0 24px', borderRadius: '8px', border: 'none', background: '#6FCF97', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Adicionar
          </button>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentList.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Nenhum item cadastrado.</div>
          ) : (
            currentList.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {editingIndex === idx ? (
                  <div style={{ display: 'flex', gap: '8px', flex: 1, marginRight: '16px', flexWrap: 'wrap' }}>
                    {activeTab === 'clubDiscounts' ? (
                      <>
                        <select value={editClub} onChange={(e) => setEditClub(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                          {(uniqueClubs as string[]).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={editDiscountService} onChange={(e) => setEditDiscountService(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                           <option value="Todos">Todos os serviços</option>
                           <option value="Encordoamento">Encordoamento</option>
                           <option value="Trocar grip base">Trocar grip base</option>
                           <option value="Trocar overgrip">Trocar overgrip</option>
                           <option value="Serviço customizado">Serviço customizado</option>
                           <option value="Compra de raquete nova">Compra de raquete nova</option>
                           <option value="Outros serviços">Outros serviços</option>
                        </select>
                        <input type="number" value={editDiscountPercent} onChange={(e) => setEditDiscountPercent(e.target.value)} placeholder="%" style={{ width: '70px', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} style={{ width: '120px', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'rgb(148, 163, 184)' }} />
                          <span style={{ color: 'white' }}>-</span>
                          <input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} style={{ width: '120px', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'rgb(148, 163, 184)' }} />
                        </div>
                      </>
                    ) : activeTab === 'commissions' ? (
                      <select
                        value={editItemText}
                        onChange={(e) => setEditItemText(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                      >
                        <option value="Encordoamento">Encordoamento</option>
                        <option value="Trocar grip base">Trocar grip base</option>
                        <option value="Trocar overgrip">Trocar overgrip</option>
                        <option value="Serviço customizado">Serviço customizado</option>
                        <option value="Compra de raquete nova">Compra de raquete nova</option>
                        <option value="Outros serviços">Outros serviços</option>
                      </select>
                    ) : (
                      <input 
                        type="text"
                        value={editItemText}
                        autoFocus
                        onChange={(e) => setEditItemText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--primary-color)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                      />
                    )}
                    {activeTab === 'commissions' && (
                      <input 
                        type="number"
                        value={editCommissionPercent}
                        onChange={(e) => setEditCommissionPercent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                        style={{ width: '80px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--primary-color)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                      />
                    )}
                    {activeTab === 'strings' && (
                      <input 
                        type="number"
                        value={editStringPrice}
                        onChange={(e) => setEditStringPrice(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                        style={{ width: '80px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--primary-color)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                      />
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                     <span style={{ color: 'white', fontWeight: 500, fontSize: '15px' }}>
                       {activeTab === 'commissions' || activeTab === 'strings' ? (typeof item === 'string' ? item : item.name) : activeTab === 'clubDiscounts' ? `${item.club} - ${item.service}` : item}
                     </span>
                     {activeTab === 'commissions' && (
                       <span style={{ color: '#F2C94C', fontWeight: 700, fontSize: '13px', padding: '4px 8px', background: 'rgba(242, 201, 76, 0.1)', borderRadius: '100px' }}>
                         {item.percent}%
                       </span>
                     )}
                     {activeTab === 'strings' && typeof item !== 'string' && (
                       <span style={{ color: '#4298E7', fontWeight: 700, fontSize: '13px', padding: '4px 8px', background: 'rgba(66, 152, 231, 0.1)', borderRadius: '100px' }}>
                         BRL {item.price.toFixed(2)}
                       </span>
                     )}
                     {activeTab === 'clubDiscounts' && (
                       <span style={{ color: '#6FCF97', fontWeight: 700, fontSize: '13px', padding: '4px 8px', background: 'rgba(111, 207, 151, 0.1)', borderRadius: '100px' }}>
                         -{item.percent}% {item.startDate ? `(${item.startDate.split('-').reverse().join('/')} até ${item.endDate.split('-').reverse().join('/')})` : '(Sempre)'}
                       </span>
                     )}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {editingIndex === idx ? (
                    <button onClick={() => saveEdit(idx)} style={{ background: '#6FCF97', border: 'none', color: 'var(--text-dark)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                      Salvar
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(idx)} style={{ background: '#4298E7', border: 'none', color: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                      <Edit size={16} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(idx)} style={{ background: '#EB5757', border: 'none', color: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </motion.div>
  );
};
