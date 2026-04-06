import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';

export const CustomerNotesModal = ({ isOpen, onClose, customerName }: any) => {
  const [notes, setNotes] = useState<{ id: string, text: string, date: string }[]>(() => {
    const saved = localStorage.getItem('tt_customer_notes_' + customerName);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  if (!isOpen) return null;

  const saveNotes = (updatedNotes: any) => {
    setNotes(updatedNotes);
    localStorage.setItem('tt_customer_notes_' + customerName, JSON.stringify(updatedNotes));
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const note = {
      id: Math.random().toString(36).substring(7),
      text: newNoteText,
      date: new Date().toLocaleDateString('pt-BR')
    };
    saveNotes([...notes, note]);
    setNewNoteText('');
    setIsAddingNote(false);
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter((n: any) => n.id !== id));
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '800px', background: 'white',
          borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#111827' }}>Notas</h2>
          <button onClick={() => { onClose(); setIsAddingNote(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            {!isAddingNote && (
              <button onClick={() => setIsAddingNote(true)} style={{ background: '#4298E7', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Plus size={18} /> Adicionar Nota
              </button>
            )}
          </div>

          {isAddingNote && (
            <div style={{ marginBottom: '24px', background: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <textarea 
                autoFocus
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Escreva a nota sobre o cliente aqui..."
                style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '6px', border: '1px solid #D1D5DB', marginBottom: '12px', resize: 'none' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => { setIsAddingNote(false); setNewNoteText(''); }} style={{ background: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleAddNote} style={{ background: '#10B981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Salvar</button>
              </div>
            </div>
          )}

          {/* Table */}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  <th style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#374151', width: '70%' }}>Nota</th>
                  <th style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Data</th>
                  <th style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#374151', width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {notes.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>Nenhum dado disponível na tabela</td>
                  </tr>
                ) : (
                  notes.map(note => (
                    <tr key={note.id} style={{ borderTop: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#111827', whiteSpace: 'pre-wrap' }}>{note.text}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>{note.date}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteNote(note.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', color: '#6B7280', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Mostrar
              <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #D1D5DB', background: '#F9FAFB' }}>
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              registros
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div>Mostrando {notes.length === 0 ? 0 : 1} a {notes.length} de {notes.length} registros</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontWeight: 600, cursor: 'not-allowed' }}>Anterior</button>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontWeight: 600, cursor: 'not-allowed' }}>Próximo</button>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
