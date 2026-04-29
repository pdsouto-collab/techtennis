const fs = require('fs');
const path = './web/src/components/StringerDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add states
content = content.replace(
  "const [jobStringingPoint, setJobStringingPoint] = useState('');",
  "const [jobStringingPoint, setJobStringingPoint] = useState('');\n  const [hasOwnReel, setHasOwnReel] = useState(false);\n  const [hasOwnSet, setHasOwnSet] = useState(false);\n  const [hasLogo, setHasLogo] = useState(false);\n  const [logoNotes, setLogoNotes] = useState('');\n  const [racketNotes, setRacketNotes] = useState('');"
);

// 2. Add to payload
content = content.replace(
  "stringingPoint: jobStringingPoint\n    };",
  "stringingPoint: jobStringingPoint,\n      hasOwnReel,\n      hasOwnSet,\n      hasLogo,\n      logoNotes,\n      racketNotes\n    };"
);

// 3. Add to resetForm
content = content.replace(
  "setJobStringingPoint('');\n  };",
  "setJobStringingPoint('');\n    setHasOwnReel(false);\n    setHasOwnSet(false);\n    setHasLogo(false);\n    setLogoNotes('');\n    setRacketNotes('');\n  };"
);

// 4. Add to startEditingJob
content = content.replace(
  "setJobStringingPoint(job.stringingPoint || '');\n    setView('new_job');",
  "setJobStringingPoint(job.stringingPoint || '');\n    setHasOwnReel(job.hasOwnReel || false);\n    setHasOwnSet(job.hasOwnSet || false);\n    setHasLogo(job.hasLogo || false);\n    setLogoNotes(job.logoNotes || '');\n    setRacketNotes(job.racketNotes || '');\n    setView('new_job');"
);

// 5. Connect UI for Usa rolo
content = content.replace(
  /<input type="checkbox" style=\{\{ accentColor: '#D93B65', width: '20px', height: '20px' \}\} \/>/g,
  (match, offset, fullText) => {
    // Only replace the first occurrence (Usa rolo próprio) with hasOwnReel
    if (fullText.substring(0, offset).includes('Usa rolo próprio')) {
      return `<input type="checkbox" checked={hasOwnReel} onChange={e => setHasOwnReel(e.target.checked)} style={{ accentColor: '#D93B65', width: '20px', height: '20px' }} />`;
    }
    return match;
  }
);

// 6. Connect UI for Usa set
content = content.replace(
  /<input type="checkbox" style=\{\{ accentColor: '#D93B65', width: '20px', height: '20px' \}\} \/>/g,
  (match, offset, fullText) => {
    // Replace the occurrence after Usa set próprio with hasOwnSet
    if (fullText.substring(0, offset).includes('Usa set próprio')) {
      return `<input type="checkbox" checked={hasOwnSet} onChange={e => setHasOwnSet(e.target.checked)} style={{ accentColor: '#D93B65', width: '20px', height: '20px' }} />`;
    }
    return match;
  }
);

// 7. Connect UI for Logo
content = content.replace(
  /<select style=\{inputStyle\}><option>Não<\/option><option>Sim<\/option><\/select>/g,
  `<select value={hasLogo ? 'Sim' : 'Não'} onChange={e => setHasLogo(e.target.value === 'Sim')} style={inputStyle}><option value="Não">Não</option><option value="Sim">Sim</option></select>`
);

// 8. Connect UI for Notas do Logo
content = content.replace(
  /<label style=\{\{ display: 'block', marginBottom: '8px', color: 'var\(--text-secondary\)' \}\}>Notas do Logo<\/label>\s*<textarea rows=\{2\} style=\{\{ \.\.\.inputStyle, resize: 'none' \}\}>\s*<\/textarea>/g,
  `<label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Notas do Logo</label>\n                        <textarea rows={2} value={logoNotes} onChange={e => setLogoNotes(e.target.value)} style={{ ...inputStyle, resize: 'none' }}></textarea>`
);
// Fallback if textarea is closed immediately
content = content.replace(
  /<label style=\{\{ display: 'block', marginBottom: '8px', color: 'var\(--text-secondary\)' \}\}>Notas do Logo<\/label>\s*<textarea rows=\{2\} style=\{\{ \.\.\.inputStyle, resize: 'none' \}\}><\/textarea>/g,
  `<label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Notas do Logo</label>\n                        <textarea rows={2} value={logoNotes} onChange={e => setLogoNotes(e.target.value)} style={{ ...inputStyle, resize: 'none' }}></textarea>`
);

// 9. Connect UI for Notas sobre a raquete
content = content.replace(
  /<label style=\{\{ display: 'block', marginBottom: '8px', color: 'var\(--text-secondary\)' \}\}>Notas sobre a raquete<\/label>\s*<textarea rows=\{2\} style=\{\{ \.\.\.inputStyle, resize: 'none' \}\}>\s*<\/textarea>/g,
  `<label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Notas sobre a raquete</label>\n                        <textarea rows={2} value={racketNotes} onChange={e => setRacketNotes(e.target.value)} style={{ ...inputStyle, resize: 'none' }}></textarea>`
);
// Fallback if textarea is closed immediately
content = content.replace(
  /<label style=\{\{ display: 'block', marginBottom: '8px', color: 'var\(--text-secondary\)' \}\}>Notas sobre a raquete<\/label>\s*<textarea rows=\{2\} style=\{\{ \.\.\.inputStyle, resize: 'none' \}\}><\/textarea>/g,
  `<label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Notas sobre a raquete</label>\n                        <textarea rows={2} value={racketNotes} onChange={e => setRacketNotes(e.target.value)} style={{ ...inputStyle, resize: 'none' }}></textarea>`
);


fs.writeFileSync(path, content, 'utf8');
console.log("StringerDashboard patched successfully with Logo fields");
