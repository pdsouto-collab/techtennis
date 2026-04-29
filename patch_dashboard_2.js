const fs = require('fs');
const path = './web/src/components/StringerDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// 2. Add to payload
content = content.replace(
  /stringerName:\s*dashboardStringer\s*\n\s*\};/,
  "stringerName: dashboardStringer,\n      pickupNotes,\n      stringingPoint: jobStringingPoint\n    };"
);

// 3. Add to resetForm
content = content.replace(
  /setPickupDate\(''\);\s*\n\s*setDashboardStringer\(''\);/,
  "setPickupDate('');\n    setDashboardStringer('');\n    setPickupNotes('');\n    setJobStringingPoint('');"
);

// 4. Add to startEditingJob
content = content.replace(
  /setDashboardStringer\(job\.stringerName \|\| ''\);\s*\n\s*setView\('new_job'\);/,
  "setDashboardStringer(job.stringerName || '');\n    setPickupNotes(job.pickupNotes || '');\n    setJobStringingPoint(job.stringingPoint || '');\n    setView('new_job');"
);

// 5. Remove green arrow button
content = content.replace(
  /<button onClick=\{\(\) => newJobStep === 2 \? setNewJobStep\(1\) : setView\('dashboard'\)\} style=\{\{\s*background:\s*'none',\s*border:\s*'none',\s*color:\s*'var\(--primary-color\)',\s*cursor:\s*'pointer',\s*display:\s*'flex',\s*alignItems:\s*'center',\s*justifyContent:\s*'center'\s*\}\}>\s*<ArrowLeft size=\{24\} \/>\s*<\/button>/,
  `{newJobStep === 2 && (
                  <button onClick={() => setNewJobStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft size={24} />
                  </button>
                )}`
);

// 6. Fix "Ponto de Encordoamento" select to bind to jobStringingPoint
content = content.replace(
  /<select style=\{inputStyle\}>\s*<option value="">Selecione\.\.\.<\/option>\s*\{appSettings\.pickupPoints\.map\(\(p:\s*string\) => <option key=\{p\} value=\{p\}>\{p\}<\/option>\)\}\s*<\/select>/,
  `<select value={jobStringingPoint} onChange={e => setJobStringingPoint(e.target.value)} style={inputStyle}>
                      <option value="">Selecione...</option>
                      {appSettings.pickupPoints.map((p: string) => <option key={p} value={p}>{p}</option>)}
                    </select>`
);

// 7. Fix "Observações" textarea to bind to pickupNotes and remove "(Notes)"
content = content.replace(
  /<label style=\{\{ display: 'block', marginBottom: '8px', color: 'var\(--text-secondary\)' \}\}>Observações \(Notes\)<\/label>\s*<textarea rows=\{4\} style=\{\{ \.\.\.inputStyle, resize: 'none' \}\}>\s*<\/textarea>/,
  `<label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações</label>
                  <textarea rows={4} value={pickupNotes} onChange={e => setPickupNotes(e.target.value)} style={{ ...inputStyle, resize: 'none' }}></textarea>`
);

// If the textarea doesn't have spaces inside tags:
content = content.replace(
  /<label style=\{\{ display: 'block', marginBottom: '8px', color: 'var\(--text-secondary\)' \}\}>Observações \(Notes\)<\/label>\s*<textarea rows=\{4\} style=\{\{ \.\.\.inputStyle, resize: 'none' \}\}><\/textarea>/,
  `<label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações</label>
                  <textarea rows={4} value={pickupNotes} onChange={e => setPickupNotes(e.target.value)} style={{ ...inputStyle, resize: 'none' }}></textarea>`
);

fs.writeFileSync(path, content, 'utf8');
console.log("StringerDashboard patched successfully part 2");
