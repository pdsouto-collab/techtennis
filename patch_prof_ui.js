const fs = require('fs');
const path = './web/src/components/ProfessorSingleClass.tsx';
let content = fs.readFileSync(path, 'utf8');

// Change the 'Ficar Online' button to a Toggle Switch
const toggleCode = `
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '18px' }}>Status no Radar</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>Fique online para receber alunos próximos.</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input 
                    type="checkbox" 
                    checked={phase === 'requests'}
                    onChange={async (e) => {
                      const isNowOnline = e.target.checked;
                      await fetch(\`\${API_URL}/api/single-class/profile\`, {
                        method: 'POST',
                        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({ price, experience, maxDistance, specialty, isOnline: isNowOnline })
                      });
                      setPhase(isNowOnline ? 'requests' : 'config');
                    }}
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: phase === 'requests' ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)',
                    transition: '.4s', borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '26px', width: '26px', left: '4px', bottom: '4px',
                      backgroundColor: phase === 'requests' ? 'var(--text-dark)' : 'white',
                      transition: '.4s', borderRadius: '50%',
                      transform: phase === 'requests' ? 'translateX(26px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>
`;

content = content.replace(
  /<button onClick=\{async \(\) => \{[\s\S]*?<\/button>/,
  toggleCode
);

// We need to keep the requests UI if it's in requests phase. Actually, if they toggle it on, they just stay on config and see requests below?
// Right now, if phase === 'requests', it shows the requests list and hides config. Let's make it show config AND requests if phase === 'requests'.

content = content.replace(
  /\{phase === 'config' && \([\s\S]*?\}\)/,
  `{(phase === 'config' || phase === 'requests') && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel"
              style={{ padding: '32px', borderRadius: '24px', marginBottom: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <button onClick={() => navigate('/')} style={{ background: 'var(--bg-panel)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <ArrowLeft size={24} />
                </button>
                <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 800, margin: 0 }}>Seu Perfil de Aulas</h1>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Configure como os alunos verão você no radar de aulas avulsas.</p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                  <DollarSign size={18} color="var(--primary-color)" /> Valor por Hora (R$)
                </label>
                <input 
                  type="number" 
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="Ex: 150"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', outline: 'none', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                  <Award size={18} color="var(--primary-color)" /> Anos de Experiência
                </label>
                <input 
                  type="number" 
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="Ex: 5"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', outline: 'none', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600 }}>
                   <MapPin size={18} color="var(--primary-color)" /> Raio Máximo de Atendimento ({maxDistance} km)
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="5" 
                  value={maxDistance} 
                  onChange={e => setMaxDistance(Number(e.target.value))} 
                  style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '13px', marginTop: '8px' }}>
                  <span>5km</span>
                  <span>25km</span>
                  <span>50km</span>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '12px', fontWeight: 600 }}>Especialidade / Foco (Opcional)</label>
                <textarea 
                  placeholder="Ex: Foco em performance, correção biomecânica, treinos táticos..."
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', outline: 'none', resize: 'vertical', minHeight: '100px' }}
                />
              </div>

              ${toggleCode}
            </motion.div>
          )}`
);

// Modify Requests list to fit below config
content = content.replace(
  /\{phase === 'requests' && \([\s\S]*?<div style=\{\{ display: 'flex', alignItems: 'center', gap: '16px' \}\}>[\s\S]*?<\/div>[\s\S]*?<div style=\{\{ background: 'rgba\(16, 185, 129, 0\.1\)'/,
  `{phase === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, margin: 0 }}>Radar Ativo</h2>
                 </div>
                 <div style={{ background: 'rgba(16, 185, 129, 0.1)'`
);

// Change the background task handling when toggle is off
content = content.replace(
  /const handleBack = async \(\) => \{[\s\S]*?\};/,
  `const handleBack = async () => {
    if(phase === 'chat') {
      setPhase('requests');
      setActiveMatch(null);
    } else {
      navigate('/');
    }
  };`
);

// We should also remove the "pulse-dot" related background string since we changed it. Wait, the pulse dot is still there in the UI.

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Prof Single Class UI');
