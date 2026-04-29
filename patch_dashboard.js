const fs = require('fs');
const path = './web/src/components/StringerDashboard.tsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Add states
content = content.replace(
  "const [pickupDate, setPickupDate] = useState('');",
  "const [pickupDate, setPickupDate] = useState('');\n  const [pickupNotes, setPickupNotes] = useState('');\n  const [jobStringingPoint, setJobStringingPoint] = useState('');"
);

// 2. Add to payload
content = content.replace(
  "stringerName: dashboardStringer\n    };",
  "stringerName: dashboardStringer,\n      pickupNotes,\n      stringingPoint: jobStringingPoint\n    };"
);

// 3. Add to resetForm
content = content.replace(
  "setPickupDate('');\n    setDashboardStringer('');",
  "setPickupDate('');\n    setDashboardStringer('');\n    setPickupNotes('');\n    setJobStringingPoint('');"
);

// 4. Add to startEditingJob
content = content.replace(
  "setDashboardStringer(job.stringerName || '');\n    \n    setView('new_job');",
  "setDashboardStringer(job.stringerName || '');\n    setPickupNotes(job.pickupNotes || '');\n    setJobStringingPoint(job.stringingPoint || '');\n    \n    setView('new_job');"
);

// 5. Remove green arrow button
content = content.replace(
  `<button onClick={() => newJobStep === 2 ? setNewJobStep(1) : setView('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowLeft size={24} />
                </button>`,
  `{newJobStep === 2 && (
                  <button onClick={() => setNewJobStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft size={24} />
                  </button>
                )}`
);

// 6. Fix "Ponto de Encordoamento" select to bind to jobStringingPoint
content = content.replace(
  `<select style={inputStyle}>
                      <option value="">Selecione...</option>
                      {appSettings.pickupPoints.map((p: string) => <option key={p} value={p}>{p}</option>)}
                    </select>`,
  `<select value={jobStringingPoint} onChange={e => setJobStringingPoint(e.target.value)} style={inputStyle}>
                      <option value="">Selecione...</option>
                      {appSettings.pickupPoints.map((p: string) => <option key={p} value={p}>{p}</option>)}
                    </select>`
);

// 7. Fix "Observações" textarea to bind to pickupNotes and remove "(Notes)"
content = content.replace(
  `<label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações (Notes)</label>
                  <textarea rows={4} style={{ ...inputStyle, resize: 'none' }}></textarea>`,
  `<label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações</label>
                  <textarea rows={4} value={pickupNotes} onChange={e => setPickupNotes(e.target.value)} style={{ ...inputStyle, resize: 'none' }}></textarea>`
);

fs.writeFileSync(path, content, 'utf8');
console.log("StringerDashboard patched successfully");
