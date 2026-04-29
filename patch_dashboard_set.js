const fs = require('fs');
const path = './web/src/components/StringerDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<span>Usa set próprio<\/span>\s*<input type="checkbox" checked=\{hasOwnReel\} onChange=\{e => setHasOwnReel\(e\.target\.checked\)\} style=\{\{ accentColor: '#D93B65', width: '20px', height: '20px' \}\} \/>/,
  `<span>Usa set próprio</span>
                      <input type="checkbox" checked={hasOwnSet} onChange={e => setHasOwnSet(e.target.checked)} style={{ accentColor: '#D93B65', width: '20px', height: '20px' }} />`
);

// Fallback in case encoding causes it to not match "próprio"
content = content.replace(
  /<span>Usa set pr.prio<\/span>\s*<input type="checkbox" checked=\{hasOwnReel\} onChange=\{e => setHasOwnReel\(e\.target\.checked\)\} style=\{\{ accentColor: '#D93B65', width: '20px', height: '20px' \}\} \/>/,
  `<span>Usa set próprio</span>
                      <input type="checkbox" checked={hasOwnSet} onChange={e => setHasOwnSet(e.target.checked)} style={{ accentColor: '#D93B65', width: '20px', height: '20px' }} />`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Usa set proprio');
