import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { User, UserRole } from '../contexts/AuthContext';

export const UserManagement = () => {
  const { users, updateUserStatus, deleteUser } = useAuth();
  
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<User['status']>('active');
  const [editRole, setEditRole] = useState<UserRole>('CLIENTE');

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditStatus(user.status);
    setEditRole(user.role);
  };

  const handleSave = (userId: string) => {
    updateUserStatus(userId, editStatus, editRole);
    setEditingUserId(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Configurações de Usuários</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie os acessos, permissões e aprovação de professores.</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 24px' }}>Usuário</th>
              <th style={{ padding: '16px 24px' }}>Contato</th>
              <th style={{ padding: '16px 24px' }}>Perfil / Acesso</th>
              <th style={{ padding: '16px 24px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{user.name}</span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{user.email}</span>
                </td>
                <td style={{ padding: '16px 24px', color: '#4B5563', fontSize: '14px' }}>
                  {user.phone || '-'}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {editingUserId === user.id ? (
                    <select value={editRole} onChange={e => setEditRole(e.target.value as UserRole)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #E5E7EB' }}>
                      <option value="CLIENTE">Cliente</option>
                      <option value="PROFESSOR">Professor</option>
                      <option value="PROFESSOR_PREMIUM">Professor Premium</option>
                      <option value="ENCORDOADOR">Encordoador</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700,
                      background: user.role === 'ADMIN' ? '#FEE2E2' : user.role === 'ENCORDOADOR' ? '#E0E7FF' : user.role.includes('PROFESSOR') ? '#FEF3C7' : '#DCFCE7',
                      color: user.role === 'ADMIN' ? '#991B1B' : user.role === 'ENCORDOADOR' ? '#3730A3' : user.role.includes('PROFESSOR') ? '#92400E' : '#166534'
                    }}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  {editingUserId === user.id ? (
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value as any)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #E5E7EB' }}>
                      <option value="active">Ativo</option>
                      <option value="pending">Pendente</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  ) : (
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, display: 'inline-block',
                      background: user.status === 'active' ? '#DCFCE7' : user.status === 'pending' ? '#FEF9C3' : '#FEE2E2',
                      color: user.status === 'active' ? '#166534' : user.status === 'pending' ? '#854D0E' : '#991B1B'
                    }}>
                      {user.status === 'active' ? 'Ativo' : user.status === 'pending' ? 'Pendente' : 'Bloqueado'}
                    </span>
                  )}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {user.id !== 'master-admin' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {editingUserId === user.id ? (
                        <>
                          <button onClick={() => handleSave(user.id)} style={{ background: 'transparent', border: 'none', color: '#10B981', cursor: 'pointer' }}><Save size={18} /></button>
                          <button onClick={() => setEditingUserId(null)} style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }}><X size={18} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(user)} style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }}><Edit size={18} /></button>
                          <button onClick={() => window.confirm('Deseja excluir este usuário?') && deleteUser(user.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
