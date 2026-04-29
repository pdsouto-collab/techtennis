import { useState } from 'react';
import { applyPhoneMask } from '../utils/masks';
import { motion } from 'framer-motion';
import { Trash2, Edit, X, Plus, CheckCircle, Ban, Users, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { User, UserRole } from '../contexts/AuthContext';

export const UserManagement = () => {
  const { users, updateUserStatus, deleteUser, adminCreateUser, adminUpdateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
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

  const activeUsers = users.filter(u => u.status !== 'pending');
  const pendingUsers = users.filter(u => u.status === 'pending');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>Gestão de Usuários</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie os acessos ao sistema</p>
        </div>
        <button onClick={handleAdd} style={{ background: 'var(--primary-color)', color: '#2D1E4B', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={18} /> Adicionar Usuário
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => setActiveTab('active')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'active' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'active' ? 'var(--primary-color)' : 'white', fontWeight: 700, cursor: 'pointer', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} /> Usuários Existentes ({activeUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'pending' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'pending' ? 'var(--primary-color)' : 'white', fontWeight: 700, cursor: 'pointer', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} /> Solicitações Pendentes ({pendingUsers.length})
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 24px' }}>Usuário</th>
              <th style={{ padding: '16px 24px' }}>Contato</th>
              <th style={{ padding: '16px 24px' }}>Perfil / Acesso</th>
              <th style={{ padding: '16px 24px', textAlign: 'center' }}>Vínculo (ID TechTennis)</th>
              {activeTab === 'active' && <th style={{ padding: '16px 24px', textAlign: 'center' }}>Status</th>}
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'active' ? activeUsers : pendingUsers).map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, color: '#2D1E4B' }}>{user.name}</span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{user.email}</span>
                </td>
                <td style={{ padding: '16px 24px', color: '#4B5563', fontSize: '14px' }}>
                  {user.phone ? applyPhoneMask(user.phone) : '-'}
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
                <td style={{ padding: '16px 24px', textAlign: 'center', fontWeight: 'bold', color: user.numericId ? '#2563EB' : '#9CA3AF' }}>
                   {user.numericId ? `#${user.numericId}` : 'Não Vinculado'}
                </td>
                {activeTab === 'active' && (
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, display: 'inline-block',
                      background: user.status === 'active' ? '#DCFCE7' : '#FEE2E2',
                      color: user.status === 'active' ? '#166534' : '#991B1B'
                    }}>
                      {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                    </span>
                  </td>
                )}
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {activeTab === 'active' ? (
                        <button onClick={() => updateUserStatus(user.id, user.status === 'blocked' ? 'active' : 'blocked', undefined, user.numericId)} style={{ background: 'transparent', border: 'none', color: user.status === 'blocked' ? '#10B981' : '#F59E0B', cursor: 'pointer' }} title={user.status === 'blocked' ? 'Desbloquear Usuário' : 'Bloquear Usuário'}>
                           {user.status === 'blocked' ? <CheckCircle size={18} /> : <Ban size={18} />}
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(user)} style={{ background: '#10B981', color: 'white', padding: '6px 12px', borderRadius: '6px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                           <CheckCircle size={14} /> Aprovar / Vincular
                        </button>
                      )}
                      
                      {activeTab === 'active' && (
                        <button onClick={() => handleEdit(user)} style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }} title="Editar"><Edit size={18} /></button>
                      )}
                      <button onClick={() => window.confirm('Deseja deletar este usuário do sistema?') && deleteUser(user.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Excluir Definitivamente"><Trash2 size={18} /></button>
                    </div>
                </td>
              </tr>
            ))}
            {(activeTab === 'active' ? activeUsers : pendingUsers).length === 0 && (
               <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Nenhum usuário encontrado nesta aba.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,12,60,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: '600px', background: 'white', borderRadius: '24px', overflow: 'hidden' }}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const userData = {
                        name: fd.get('name') as string,
                        email: fd.get('email') as string,
                        password: fd.get('password') as string,
                        phone: fd.get('phone') as string,
                        role: fd.get('role') as UserRole,
                        status: fd.get('status') as User['status'],
                        numericId: fd.get('numericId') ? parseInt(fd.get('numericId') as string, 10) : undefined
                    };
                    if (selectedUser) {
                        adminUpdateUser(selectedUser.id, userData);
                    } else {
                        adminCreateUser(userData);
                    }
                    setIsModalOpen(false);
                }}>
                    <div style={{ background: 'var(--primary-color)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-dark)', fontSize: '20px', fontWeight: 700, margin: 0 }}>
                           {selectedUser?.status === 'pending' ? 'Aprovar / Vincular Acesso' : (selectedUser ? 'Editar Usuário' : 'Adicionar Usuário')}
                        </h3>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer' }}><X size={24} /></button>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        <div style={{ background: '#F0F9FF', padding: '16px', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
                          <label style={{ display: 'block', marginBottom: '8px', color: '#0369A1', fontWeight: 800, fontSize: '14px' }}>
                            ID TechTennis
                          </label>
                          <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#0284C7' }}>
                            Para que este usuário controle seu Próprio Histórico (como Cliente), Aulas (como Professor) ou Rackets, conecte-o a um ID Mestre.
                          </p>
                          <input type="number" name="numericId" defaultValue={selectedUser?.numericId || ''} placeholder="Ex: 162310" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #7DD3FC', color: '#0369A1', background: 'white', fontWeight: 700 }} />
                        </div>

                        <div><label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Nome Completo *</label><input required name="name" defaultValue={selectedUser?.name || ''} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827' }} /></div>
                        <div><label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Email *</label><input required type="email" name="email" defaultValue={selectedUser?.email || ''} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827' }} /></div>
                        <div><label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Senha de Acesso</label><input required type="text" name="password" defaultValue={selectedUser?.password || '123456'} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827' }} /></div>
                        <div><label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Telefone</label><input name="phone" onChange={(e) => e.target.value = applyPhoneMask(e.target.value)} defaultValue={selectedUser?.phone ? applyPhoneMask(selectedUser.phone) : ''} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827' }} /></div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Perfil de Acesso ao Painel</label>
                                <select name="role" defaultValue={selectedUser?.role || 'CLIENTE'} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827', background: 'white' }}>
                                    <option value="CLIENTE">Painel Restrito (Apenas Cliente)</option>
                                    <option value="PROFESSOR">Painel de Professor Base</option>
                                    <option value="PROFESSOR_PREMIUM">Painel de Professor Premium</option>
                                    <option value="ENCORDOADOR">Encordoador / Vendedor</option>
                                    <option value="ADMIN">Administrador Geral</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563', fontWeight: 600, fontSize: '14px' }}>Status da Conta</label>
                                <select name="status" defaultValue={selectedUser?.status === 'pending' ? 'active' : (selectedUser?.status || 'active')} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#111827', background: 'white', fontWeight: 700 }}>
                                    <option value="active">Liberado (Ativo)</option>
                                    <option value="pending">Pendente de Avaliação</option>
                                    <option value="blocked">Bloqueado Temporariamente</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '24px', background: '#F9FAFB', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E5E7EB' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancelar</button>
                        <button type="submit" className="button-primary" style={{ padding: '12px 24px' }}>
                           {selectedUser?.status === 'pending' ? 'Confirmar Aprovação' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
      )}
    </motion.div>
  );
};
