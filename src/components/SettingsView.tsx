import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Edit } from 'lucide-react';

export const SettingsView = ({ settings, setSettings }: any) => {
  const [activeTab, setActiveTab] = useState<'strings' | 'pickupPoints' | 'machines' | 'stringers'>('strings');
  
  const [newItemText, setNewItemText] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItemText, setEditItemText] = useState('');

  const currentList = settings[activeTab] || [];

  const handleAdd = () => {
    if (!newItemText.trim()) return;
    setSettings((prev: any) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItemText.trim()]
    }));
    setNewItemText('');
  };

  const handleDelete = (index: number) => {
    setSettings((prev: any) => {
      const newList = [...prev[activeTab]];
      newList.splice(index, 1);
      return { ...prev, [activeTab]: newList };
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditItemText(currentList[index]);
  };

  const saveEdit = (index: number) => {
    if (!editItemText.trim()) return;
    setSettings((prev: any) => {
      const newList = [...prev[activeTab]];
      newList[index] = editItemText.trim();
      return { ...prev, [activeTab]: newList };
    });
    setEditingIndex(null);
  };

  const tabs = [
    { id: 'strings', label: 'Corda (Main/Cross)' },
    { id: 'pickupPoints', label: 'Ponto de Encordoamento' },
    { id: 'machines', label: 'Máquina de Encordoamento' },
    { id: 'stringers', label: 'Encordoador' },
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
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <input 
            type="text" 
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder={`Adicionar novo ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
          />
          <button onClick={handleAdd} style={{ padding: '0 24px', borderRadius: '8px', border: 'none', background: '#6FCF97', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Adicionar
          </button>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentList.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Nenhum item cadastrado.</div>
          ) : (
            currentList.map((item: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {editingIndex === idx ? (
                  <input 
                    type="text"
                    value={editItemText}
                    autoFocus
                    onChange={(e) => setEditItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                    onBlur={() => saveEdit(idx)}
                    style={{ flex: 1, marginRight: '16px', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--primary-color)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                  />
                ) : (
                  <span style={{ color: 'white', fontWeight: 500, fontSize: '15px' }}>{item}</span>
                )}
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(idx)} style={{ background: '#4298E7', border: 'none', color: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                    <Edit size={16} />
                  </button>
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
