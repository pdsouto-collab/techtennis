import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Trophy, Target, Calendar, Radio } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const FriendlyMatchRadar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [radius, setRadius] = useState<number>(10);
  const [myCategory, setMyCategory] = useState<string>('');
  
  const opponentCategories = ['Especial', 'A', 'B', 'C'];
  const [selectedOpponentCategories, setSelectedOpponentCategories] = useState<string[]>([]);
  
  const [courtType, setCourtType] = useState<'Possui Quadra' | 'Quadra Alugada' | ''>('');
  
  const [ageRange, setAgeRange] = useState<string>('');

  const [isActive, setIsActive] = useState(false);

  const toggleOpponentCategory = (cat: string) => {
    setSelectedOpponentCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleToggleAllOpponents = () => {
    if (selectedOpponentCategories.length === opponentCategories.length) {
      setSelectedOpponentCategories([]);
    } else {
      setSelectedOpponentCategories([...opponentCategories]);
    }
  };

  const handleActivateRadar = () => {
    if (!myCategory) {
      alert('Por favor, selecione sua categoria.');
      return;
    }
    if (selectedOpponentCategories.length === 0) {
      alert('Selecione pelo menos uma categoria de adversário.');
      return;
    }
    if (!courtType) {
      alert('Informe sobre a quadra.');
      return;
    }

    setIsActive(true);
    // Future: send to backend
    alert('Você agora está ativo no Radar de Busca para amistosos!');
  };

  const handleDeactivateRadar = () => {
    setIsActive(false);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 5% 40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'var(--bg-panel)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
          Buscar Amistoso
        </h1>
      </div>

      <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
        {isActive ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ 
              width: '100px', height: '100px', background: 'rgba(56, 212, 48, 0.1)', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 24px', position: 'relative' 
            }}>
              <div style={{
                position: 'absolute', inset: 0, border: '2px solid #38D430', borderRadius: '50%',
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}></div>
              <Radio size={48} color="#38D430" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Você está ativo no Radar!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Buscando adversários num raio de {radius}km...
            </p>
            
            <button 
              onClick={handleDeactivateRadar}
              style={{ 
                background: '#EF4444', color: 'white', border: 'none', padding: '16px 32px', 
                borderRadius: '100px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', width: '100%' 
              }}
            >
              Parar Busca
            </button>
            <style>{`
              @keyframes ping {
                75%, 100% {
                  transform: scale(2);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Raio de Busca */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                <MapPin size={20} color="var(--primary-color)" /> Raio de Busca
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input 
                  type="range" 
                  min="5" max="50" step="5" 
                  value={radius} 
                  onChange={e => setRadius(Number(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--primary-color)' }} 
                />
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-color)', minWidth: '60px' }}>
                  {radius} km
                </span>
              </div>
            </div>

            {/* Minha Categoria */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                <Trophy size={20} color="var(--primary-color)" /> Minha Categoria
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {['Especial', 'A', 'B', 'C'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setMyCategory(cat)}
                    style={{ 
                      flex: 1, minWidth: '100px', padding: '12px', borderRadius: '12px', border: '2px solid',
                      borderColor: myCategory === cat ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                      background: myCategory === cat ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                      color: myCategory === cat ? '#2D1E4B' : 'var(--text-secondary)',
                      fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Categoria do Adversário */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <Target size={20} color="var(--primary-color)" /> Categoria do Adversário
                </label>
                <button 
                  onClick={handleToggleAllOpponents}
                  style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {selectedOpponentCategories.length === opponentCategories.length ? 'Desmarcar Todas' : 'Marcar Todas'}
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {opponentCategories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => toggleOpponentCategory(cat)}
                    style={{ 
                      flex: 1, minWidth: '100px', padding: '12px', borderRadius: '12px', border: '2px solid',
                      borderColor: selectedOpponentCategories.includes(cat) ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                      background: selectedOpponentCategories.includes(cat) ? 'rgba(56, 212, 48, 0.1)' : 'rgba(255,255,255,0.05)',
                      color: selectedOpponentCategories.includes(cat) ? 'var(--primary-color)' : 'var(--text-secondary)',
                      fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quadra */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                <MapPin size={20} color="var(--primary-color)" /> Quadra
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Possui Quadra', 'Quadra Alugada'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setCourtType(type as any)}
                    style={{ 
                      flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid',
                      borderColor: courtType === type ? '#60A5FA' : 'rgba(255,255,255,0.1)',
                      background: courtType === type ? 'rgba(96, 165, 250, 0.1)' : 'rgba(255,255,255,0.05)',
                      color: courtType === type ? '#60A5FA' : 'var(--text-secondary)',
                      fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Faixa Etária (Opcional) */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                <Calendar size={20} color="var(--primary-color)" /> Faixa Etária <span style={{fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 400}}>(Opcional)</span>
              </label>
              <select 
                value={ageRange} 
                onChange={(e) => setAgeRange(e.target.value)}
                style={{ 
                  width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px', cursor: 'pointer',
                  appearance: 'none'
                }}
              >
                <option value="" style={{color: 'black'}}>Sem preferência de idade</option>
                <option value="Até 25 anos" style={{color: 'black'}}>Até 25 anos</option>
                <option value="25+" style={{color: 'black'}}>25+</option>
                <option value="35+" style={{color: 'black'}}>35+</option>
                <option value="50+" style={{color: 'black'}}>50+</option>
                <option value="60+" style={{color: 'black'}}>60+</option>
              </select>
            </div>

            <button 
              onClick={handleActivateRadar}
              className="button-primary"
              style={{ width: '100%', padding: '18px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '16px' }}
            >
              <Radio size={24} /> Ficar Ativo no Radar de Busca
            </button>

          </div>
        )}
      </div>
    </div>
  );
};
