import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, History, Check, Info } from 'lucide-react';
import type { Customer, Racket, StringingJob } from '../types';

// Mock Data
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_CUSTOMER: Customer = {
  id: 'c1', name: 'Rafael Nadal', email: 'rafa@example.com',
  phone: '+1234567890', playStyle: 'Aggressive Baseliner', dominantHand: 'Left'
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_RACKET: Racket = {
  id: 'r1', customerId: 'c1', brand: 'Babolat', model: 'Pure Aero',
  stringPattern: '16x19', headSize: 100, weight: 300
};

const MOCK_HISTORY: StringingJob[] = [
  { id: 'j3', racketId: 'r1', customerId: 'c1', date: '2026-03-20', mainString: 'RPM Blast 1.25', crossString: 'RPM Blast 1.25', tensionMainLbs: 55, tensionCrossLbs: 53, preStretch: true, dynamicTensionOut: 38, notes: 'Tightened cross' },
  { id: 'j2', racketId: 'r1', customerId: 'c1', date: '2026-02-10', mainString: 'RPM Blast 1.25', crossString: 'RPM Blast 1.25', tensionMainLbs: 54, tensionCrossLbs: 52, preStretch: false, dynamicTensionOut: 37, notes: 'Normal setup' },
];

export const StringerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobSaved, setJobSaved] = useState(false);

  // Form State
  const [mainString, setMainString] = useState('');
  const [crossString, setCrossString] = useState('');
  const [tensionMain, setTensionMain] = useState(55);
  const [tensionCross, setTensionCross] = useState(53);
  const [preStretch, setPreStretch] = useState(false);
  const [dtOut, setDtOut] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    setJobSaved(true);
    setTimeout(() => setJobSaved(false), 3000);
  };

  return (
    <div style={{ padding: '80px 24px 40px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Search Header */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '16px', color: 'var(--text-primary)' }}>Registro de Serviço</h2>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Buscar por nome do cliente ou Racket QR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '16px 16px 16px 50px', 
              borderRadius: '24px', border: '1px solid var(--border-light)',
              background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)',
              fontSize: '16px', backdropFilter: 'blur(10px)'
            }}
          />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* History Card (last tensions) */}
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            <History size={20} />
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Histórico Recente</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_HISTORY.map((job) => (
              <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{job.tensionMainLbs} / {job.tensionCrossLbs} lbs</p>
                  <p style={{ color: '#b2c0cc', fontSize: '13px', marginTop: '4px' }}>{job.mainString}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{new Date(job.date).toLocaleDateString('pt-BR')}</p>
                  <p style={{ color: 'var(--primary-color)', fontSize: '12px', fontWeight: 700, marginTop: '4px' }}>DT: {job.dynamicTensionOut}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(216, 245, 51, 0.1)', border: '1px solid var(--primary-color)', borderRadius: '12px', display: 'flex', gap: '12px' }}>
            <Info color="var(--primary-color)" size={20} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#e0eaf5', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Insight (Último feedback):</span> O cliente relatou falta de conforto. Sugestão: reduzir a tensão em 2lbs ou usar corda macia.
            </p>
          </div>
        </div>

        {/* Technical Input Form */}
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>Novo Encordoamento</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Corda Main</label>
              <input type="text" required value={mainString} onChange={(e) => setMainString(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Corda Cross</label>
              <input type="text" required value={crossString} onChange={(e) => setCrossString(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Tensão Main (lbs)</label>
              <input type="number" required value={tensionMain} onChange={(e) => setTensionMain(Number(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Tensão Cross (lbs)</label>
              <input type="number" required value={tensionCross} onChange={(e) => setTensionCross(Number(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Dynamic Tension (Out)</label>
              <input type="number" value={dtOut} onChange={(e) => setDtOut(Number(e.target.value))} placeholder="Ex: 38"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={preStretch} onChange={(e) => setPreStretch(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                Aplicar Pre-Stretch
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Notas Adicionais</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-light)', color: 'white', resize: 'none' }}></textarea>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="button-primary" style={{ width: '100%', padding: '16px' }} type="submit">
            {jobSaved ? <><Check size={20} /> Serviço Salvo</> : "Salvar Encordoamento"}
          </motion.button>

        </form>

      </div>
    </div>
  );
};
