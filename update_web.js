const fs = require('fs');
let code = fs.readFileSync('web/src/components/OpenAgenda.tsx', 'utf8');

// 1. Interface
code = code.replace(
  "type: 'fixo' | 'avulso';",
  "type: 'fixo' | 'avulso';\n  resumeSummary: string;"
);

// 2. State
code = code.replace(
  "const [trainingTypes, setTrainingTypes] = useState('');",
  "const [trainingTypes, setTrainingTypes] = useState('');\n  const [resumeSummary, setResumeSummary] = useState('');"
);

// 3. resetForm
code = code.replace(
  "setTrainingTypes('');",
  "setTrainingTypes('');\n    setResumeSummary('');"
);

// 4. openForm
code = code.replace(
  "setTrainingTypes(slot.trainingTypes);",
  "setTrainingTypes(slot.trainingTypes);\n      setResumeSummary(slot.resumeSummary || '');"
);

// 5. handleSave payload
code = code.replace(
  "const payload = { professorName, timeAndDay, region, price, type, trainingTypes, phone };",
  "const payload = { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary };"
);

// 6. Modal Form UI
const oldTrainingTypesUI = `<div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Tipos de Treino</label>
                    <input type="text" value={trainingTypes} onChange={e => setTrainingTypes(e.target.value)} required style={inputStyle} placeholder="Ex: Treino Competitivo, Rebatedor, Tático" />
                  </div>`;
                  
const newTrainingAndSummaryUI = `<div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Tipos de Treino</label>
                    <input type="text" value={trainingTypes} onChange={e => setTrainingTypes(e.target.value)} required style={inputStyle} placeholder="Ex: Treino Competitivo, Rebatedor, Tático" />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Currículo Resumido</label>
                    <textarea value={resumeSummary} onChange={e => setResumeSummary(e.target.value)} style={{...inputStyle, resize: 'vertical', minHeight: '80px'}} placeholder="Ex: Ex-atleta ATP, treinador há 10 anos..." />
                  </div>`;
                  
code = code.replace(oldTrainingTypesUI, newTrainingAndSummaryUI);

// 7. Card Layout UI
const oldCardActivity = `<div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <Activity size={16} /> <span>{slot.trainingTypes}</span>
                  </div>`;
const newCardActivity = `<div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <Activity size={16} /> <span>{slot.trainingTypes}</span>
                  </div>
                  {slot.resumeSummary && (
                    <div style={{ marginTop: '4px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      "{slot.resumeSummary}"
                    </div>
                  )}
`;
code = code.replace(oldCardActivity, newCardActivity);

fs.writeFileSync('web/src/components/OpenAgenda.tsx', code);
console.log('OpenAgenda.tsx updated.');
