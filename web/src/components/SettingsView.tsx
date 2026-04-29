import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Edit } from 'lucide-react';

export const SettingsView = ({ settings, setSettings }: any) => {
  const [activeTab, setActiveTab] = useState<'strings' | 'pickupPoints' | 'machines' | 'stringers' | 'sports' | 'clubs' | 'commissions' | 'clubDiscounts'>('strings');
  
  const [newItemText, setNewItemText] = useState('');
  const [newCommissionPercent, setNewCommissionPercent] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItemText, setEditItemText] = useState('');
  const [editCommissionPercent, setEditCommissionPercent] = useState('');
  const [newStringPrice, setNewStringPrice] = useState('');
  const [editStringPrice, setEditStringPrice] = useState('');
  const [newStringType, setNewStringType] = useState('');
  const [editStringType, setEditStringType] = useState('');
  const [newStringBrand, setNewStringBrand] = useState('');
  const [editStringBrand, setEditStringBrand] = useState('');

  const [newClub, setNewClub] = useState('');
  const [newDiscountService, setNewDiscountService] = useState('');
  const [newDiscountPercent, setNewDiscountPercent] = useState('');
  const [newDiscountValue, setNewDiscountValue] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  const [editClub, setEditClub] = useState('');
  const [editDiscountService, setEditDiscountService] = useState('');
  const [editDiscountPercent, setEditDiscountPercent] = useState('');
  const [editDiscountValue, setEditDiscountValue] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  const currentList = settings[activeTab] || [];
  const uniqueClubs = settings.clubs || [];

  const handleAdd = () => {
    let value: any = newItemText.trim();
    if (activeTab === 'commissions') {
      if (!newItemText.trim()) return;
      value = { name: newItemText.trim(), percent: Number(newCommissionPercent) || 0 };
    } else if (activeTab === 'strings') {
      if (!newItemText.trim()) return;
      value = { name: newItemText.trim(), price: Number(newStringPrice) || 0, type: newStringType || 'Monofilamento', brand: newStringBrand.trim() || 'Desconhecida' };
    } else if (activeTab === 'clubDiscounts') {
      if (!newClub || !newDiscountService || (!newDiscountPercent && !newDiscountValue)) return;
      value = { club: newClub, service: newDiscountService, percent: Number(newDiscountPercent) || 0, value: Number(newDiscountValue) || 0, startDate: newStartDate, endDate: newEndDate };
    } else {
      if (!newItemText.trim()) return;
      if (currentList.some((item: any) => typeof item === 'string' && item.toLowerCase() === value.toLowerCase())) {
        alert('Atenção: Este item já existe na lista!');
        return;
      }
    }

    setSettings((prev: any) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), value]
    }));
    setNewItemText('');
    setNewCommissionPercent('');
    setNewStringPrice('');
    setNewStringType('');
    setNewStringBrand('');
    setNewClub('');
    setNewDiscountService('');
    setNewDiscountPercent('');
    setNewDiscountValue('');
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
        setEditStringType('Monofilamento');
      } else {
        setEditItemText(str.name);
        setEditStringPrice(str.price.toString());
        setEditStringType(str.type || 'Monofilamento');
        setEditStringBrand(str.brand || 'Desconhecida');
      }
    } else if (activeTab === 'clubDiscounts') {
      setEditClub(currentList[index].club);
      setEditDiscountService(currentList[index].service);
      setEditDiscountPercent(currentList[index].percent?.toString() || '');
      setEditDiscountValue(currentList[index].value?.toString() || '');
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
         newList[index] = { name: editItemText.trim(), price: Number(editStringPrice) || 0, type: editStringType || 'Monofilamento', brand: editStringBrand.trim() || 'Desconhecida' };
      } else if (activeTab === 'clubDiscounts') {
         if (!editClub.trim() || !editDiscountService || (!editDiscountPercent && !editDiscountValue)) return prev;
         newList[index] = { club: editClub.trim(), service: editDiscountService, percent: Number(editDiscountPercent) || 0, value: Number(editDiscountValue) || 0, startDate: editStartDate, endDate: editEndDate };
      } else {
         if (!editItemText.trim()) return prev;
         if (newList.some((item: any, i: number) => i !== index && typeof item === 'string' && item.toLowerCase() === editItemText.trim().toLowerCase())) {
           alert('Atenção: Este item já existe na lista!');
           return prev;
         }
         newList[index] = editItemText.trim();
      }
      return { ...prev, [activeTab]: newList };
    });
    setEditingIndex(null);
  };

  const tabs = [
    { id: 'clubs', label: 'Clubes / Condomínios' },
    { id: 'commissions', label: 'Comissão Professor (%)' },
    { id: 'strings', label: 'Corda (Main/Cross)' },
    { id: 'clubDiscounts', label: 'Desconto por Clube (%)' },
    { id: 'stringers', label: 'Encordoador' },
    { id: 'sports', label: 'Esporte' },
    { id: 'machines', label: 'Máquina de Encordoamento' },
    { id: 'pickupPoints', label: 'Ponto de Encordoamento' },
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
              <input type="number" value={newDiscountPercent} onChange={(e) => setNewDiscountPercent(e.target.value)} placeholder="Desc. %" style={{ width: '80px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              <input type="number" value={newDiscountValue} onChange={(e) => setNewDiscountValue(e.target.value)} placeholder="Desc. BRL" style={{ width: '100px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
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
            <>
              <select
                value={newStringType}
                onChange={(e) => setNewStringType(e.target.value)}
                style={{ width: '180px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              >
                <option value="" disabled style={{ color: 'rgba(255,255,255,0.6)' }}>Tipo...</option>
                <option value="Multifilamento">1- Multifilamento</option>
                <option value="Monofilamento">2- Monofilamento</option>
                <option value="Tripa Natural">3- Tripa Natural</option>
              </select>
              <input 
                type="text" 
                value={newStringBrand}
                onChange={(e) => setNewStringBrand(e.target.value)}
                placeholder="Marca"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                style={{ width: '120px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
              <input 
                type="number" 
                value={newStringPrice}
                onChange={(e) => setNewStringPrice(e.target.value)}
                placeholder="Preço (BRL)"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                style={{ width: '120px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
            </>
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
            (() => {
              const renderList = currentList.map((item: any, idx: number) => ({ item, originalIndex: idx }));
              if (activeTab === 'strings') {
                renderList.sort((a: any, b: any) => {
                  const nameA = typeof a.item === 'string' ? a.item : a.item.name;
                  const nameB = typeof b.item === 'string' ? b.item : b.item.name;
                  return nameA.localeCompare(nameB);
                });
              }
              return renderList.map(({ item, originalIndex: idx }: { item: any; originalIndex: number }) => (
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
                        <input type="number" value={editDiscountValue} onChange={(e) => setEditDiscountValue(e.target.value)} placeholder="BRL" style={{ width: '80px', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
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
                      <>
                        <select
                          value={editStringType}
                          onChange={(e) => setEditStringType(e.target.value)}
                          style={{ width: '150px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--primary-color)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                        >
                          <option value="Multifilamento">1- Multifilamento</option>
                          <option value="Monofilamento">2- Monofilamento</option>
                          <option value="Tripa Natural">3- Tripa Natural</option>
                        </select>
                        <input 
                          type="text"
                          value={editStringBrand}
                          onChange={(e) => setEditStringBrand(e.target.value)}
                          placeholder="Marca"
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                          style={{ width: '100px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--primary-color)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                        />
                        <input 
                          type="number"
                          value={editStringPrice}
                          onChange={(e) => setEditStringPrice(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                          style={{ width: '80px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--primary-color)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, paddingRight: '16px' }}>
                     {activeTab === 'strings' ? (
                       <>
                         <span style={{ color: 'white', fontWeight: 600, fontSize: '15px', flex: 1.5, minWidth: '150px' }}>
                           {typeof item === 'string' ? item : item.name}
                         </span>
                         <span style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '14px', flex: 0.8 }}>
                           {typeof item === 'string' ? 'Desconhecida' : (item.brand || 'Desconhecida')}
                         </span>
                         <span style={{ color: '#A78BFA', fontWeight: 500, fontSize: '14px', flex: 1 }}>
                           {typeof item === 'string' ? '' : item.type}
                         </span>
                         <span style={{ color: '#60A5FA', fontWeight: 500, fontSize: '14px', flex: 1 }}>
                           BRL {typeof item === 'string' ? '0.00' : item.price.toFixed(2)}
                         </span>
                       </>
                     ) : activeTab === 'commissions' ? (
                       <>
                         <span style={{ color: 'white', fontWeight: 600, fontSize: '15px', flex: 1.5, minWidth: '150px' }}>
                           {typeof item === 'string' ? item : item.name}
                         </span>
                         <span style={{ color: '#F2C94C', fontWeight: 700, fontSize: '14px', flex: 1 }}>
                           {item.percent}%
                         </span>
                       </>
                     ) : activeTab === 'clubDiscounts' ? (
                       <>
                         <span style={{ color: 'white', fontWeight: 600, fontSize: '15px', flex: 1.2, minWidth: '120px' }}>
                           {item.club}
                         </span>
                         <span style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '14px', flex: 1.5, minWidth: '150px' }}>
                           {item.service}
                         </span>
                         <span style={{ color: '#6FCF97', fontWeight: 700, fontSize: '14px', flex: 0.6 }}>
                           {item.percent ? `-${item.percent}%` : ''} {item.value ? `(BRL -${item.value})` : ''}
                         </span>
                         <span style={{ color: '#A78BFA', fontWeight: 500, fontSize: '14px', flex: 1.5 }}>
                           {item.startDate ? `${item.startDate.split('-').reverse().join('/')} até ${item.endDate.split('-').reverse().join('/')}` : 'Sempre'}
                         </span>
                       </>
                     ) : (
                       <span style={{ color: 'white', fontWeight: 500, fontSize: '15px' }}>
                         {item}
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
            ));
            })()
          )}
        </div>

      </div>
    </motion.div>
  );
};
