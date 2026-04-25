import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, X, Plus, Ban, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { User, UserRole } from '../contexts/AuthContext';

export const UserManagement = () => {
  const { users, updateUserStatus, deleteUser, adminCreateUser, adminUpdateUser } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>Configurações de Usuários</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie os acessos, permissões e aprovação de professores.</p>
        </div>
        <button onClick={handleAdd} className="button-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Adicionar Usuário
        </button>
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
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700,
                    background: user.role === 'ADMIN' ? '#FEE2E2' : user.role === 'ENCORDOADOR' ? '#E0E7FF' : user.role.includes('PROFESSOR') ? '#FEF3C7' : '#DCFCE7',
                    color: user.role === 'ADMIN' ? '#991B1B' : user.role === 'ENCORDOADOR' ? '#3730A3' : user.role.includes('PROFESSOR') ? '#92400E' : '#166534'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, display: 'inline-block',
                    background: user.status === 'active' ? '#DCFCE7' : user.status === 'pending' ? '#FEF9C3' : '#FEE2E2',
                    color: user.status === 'active' ? '#166534' : user.status === 'pending' ? '#854D0E' : '#991B1B'
                  }}>
                    {user.status === 'active' ? 'Ativo' : user.status === 'pending' ? 'Pendente' : 'Bloqueado'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => updateUserStatus(user.id, user.status === 'blocked' ? 'active' : 'blocked')} style={{ background: 'transparent', border: 'none', color: user.status === 'blocked' ? '#10B981' : '#F59E0B', cursor: 'pointer' }} title={user.status === 'blocked' ? 'Desbloquear Usuário' : 'Bloquear Usuário'}>
                       {user.status === 'blocked' ? <CheckCircle size={18} /> : <Ban size={18} />}
                      </button>
                      <button onClick={() => handleEdit(user)} style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }} title="Editar"><Edit size={18} /></button>
                      <button onClick={() => window.confirm('Deseja excluir este usuário?') && deleteUser(user.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Excluir"><Trash2 size={18} /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,12,60,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: '500px', background: 'white', borderRadius: '24px', overflow: 'hidden' }}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const userData = {
                        name: fd.get('name') as string,
                        email: fd.get('email') as string,
                        password: fd.get('password') as string,
                        phone: fd.get('phone') as string,
                        role: fd.get('role') as UserRole,
                        status: fd.get('status') as User['status']
                    };
                    if (selectedUser) {
                        adminUpdateUser(selectedUser.id, userData);
                    } else {
                        adminCreateUser(userData);
                    }
                    setIsModalOpen(false);
                }}>
                    <div style={{ background: 'var(--primary-color)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-dark)', fontSize: '20px', fontWeight: 700, margin: 0 }}>{selectedUser ? 'Editar Usuário' : 'Adicionar Usuário'}</h3>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer' }}><X size={24} /></button>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Nome Completo *</label><input required name="name" defaultValue={selectedUser?.name || ''} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827' }} /></div>
                        <div><label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Email *</label><input required type="email" name="email" defaultValue={selectedUser?.email || ''} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827' }} /></div>
                        <div><label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Senha de Acesso</label><input required type="text" name="password" defaultValue={selectedUser?.password || '123456'} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827' }} /></div>
                        <div><label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Telefone</label><input name="phone" onChange={(e) => e.target.value = applyPhoneMask(e.target.value)} defaultValue={selectedUser?.phone ? applyPhoneMask(selectedUser.phone) : ''} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827' }} /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Perfil Base</label>
                                <select name="role" defaultValue={selectedUser?.role || 'CLIENTE'} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827', background: 'white' }}>
                                    <option value="CLIENTE">Cliente</option>
                                    <option value="PROFESSOR">Professor</option>
                                    <option value="PROFESSOR_PREMIUM">Professor Premium</option>
                                    <option value="ENCORDOADOR">Encordoador</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Status Inicial</label>
                                <select name="status" defaultValue={selectedUser?.status || 'active'} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827', background: 'white' }}>
                                    <option value="active">Ativo</option>
                                    <option value="pending">Pendente de Aprovação</option>
                                    <option value="blocked">Bloqueado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '24px', background: '#F9FAFB', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancelar</button>
                        <button type="submit" className="button-primary" style={{ padding: '12px 24px' }}>Salvar Usuário</button>
                    </div>
                </form>
            </motion.div>
        </div>
      )}
    </motion.div>
  );
};
