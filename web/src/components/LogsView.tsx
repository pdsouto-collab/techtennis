import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Server, Activity, Database, Clock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SystemLog {
  id: number;
  action: string;
  resource: string;
  details: string;
  userName: string;
  createdAt: string;
}

export const LogsView = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'https://techtennis-api.vercel.app';
  const getAuthHeader = () => {
    const token = localStorage.getItem('tt_auth_token');
    return { 'Authorization': `Bearer ${token}` };
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/logs`, { headers: getAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchLogs();
  }, [currentUser]);

  const getActionColor = (action: string) => {
    if (action === 'CREATE') return '#4ADE80'; // Green
    if (action === 'UPDATE') return '#FBBF24'; // Yellow
    if (action === 'DELETE') return '#F87171'; // Red
    return '#9CA3AF'; // Gray
  };

  return (
    <div style={{ paddingTop: '140px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/')} style={{ background: 'var(--bg-panel)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <ArrowLeft size={24} />
            </button>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Server size={32} color="var(--primary-color)" /> Logs do Sistema
            </h1>
          </div>
          <button onClick={fetchLogs} className="button-primary" style={{ padding: '12px 24px', borderRadius: '100px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} /> Atualizar Logs
          </button>
        </div>

        {/* Logs List */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowX: 'auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>Carregando logs...</div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>Nenhum log encontrado.</div>
          ) : (
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', color: 'white' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '16px', fontWeight: 600 }}>Ação</th>
                  <th style={{ padding: '16px', fontWeight: 600 }}>Recurso</th>
                  <th style={{ padding: '16px', fontWeight: 600 }}>Usuário</th>
                  <th style={{ padding: '16px', fontWeight: 600 }}>Data/Hora</th>
                  <th style={{ padding: '16px', fontWeight: 600 }}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <motion.tr 
                    key={log.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        background: `${getActionColor(log.action)}20`, 
                        color: getActionColor(log.action), 
                        padding: '4px 12px', 
                        borderRadius: '100px', 
                        fontSize: '12px', 
                        fontWeight: 700 
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} color="var(--text-secondary)" /> {log.resource}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="var(--text-secondary)" /> {log.userName}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} /> {new Date(log.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </td>
                    <td style={{ padding: '16px', maxWidth: '300px' }}>
                      <div style={{ 
                        background: 'rgba(0,0,0,0.2)', 
                        padding: '8px', 
                        borderRadius: '8px', 
                        fontSize: '12px', 
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: 'monospace'
                      }} title={log.details}>
                        {log.details || '-'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};
