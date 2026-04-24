import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { User } from '../contexts/AuthContext';
import { User as UserIcon, Phone, Camera, X } from 'lucide-react';

interface ProfileSettingsModalProps {
  currentUser: User;
  onClose: () => void;
  onUpdate: (updates: Partial<User>) => Promise<boolean>;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ currentUser, onClose, onUpdate }) => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [photoUrl, setPhotoUrl] = useState(currentUser.photoUrl || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // Compress quality
          setPhotoUrl(dataUrl);
        }
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onUpdate({ name, phone, photoUrl });
    setLoading(false);
    if (success) onClose();
    else alert('Erro ao atualizar perfil.');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} 
        className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '32px', position: 'relative', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '24px', marginBottom: '24px', width: '100%', textAlign: 'center' }}>Meu Perfil</h2>
        
        <form onSubmit={handleSave} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', background: photoUrl ? "url(" + photoUrl + ") center/cover" : '#2563EB', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative', overflow: 'hidden',
              border: '4px solid rgba(255,255,255,0.1)'
            }}>
              {!photoUrl && <UserIcon size={40} />}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px 16px', borderRadius: '100px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>
              <Camera size={16} /> Alterar Foto
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Nome Completo</label>
            <div style={{ position: 'relative' }}>
              <UserIcon style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Celular</label>
            <div style={{ position: 'relative' }}>
              <Phone style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <button type="submit" disabled={loading} className="button-primary" style={{ width: '100%', padding: '16px' }}>
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
