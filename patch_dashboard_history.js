const fs = require('fs');
const path = './web/src/components/StringerDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const target1 = /<div style=\{\{ fontWeight: 600 \}\}>\{pJob\.stringCross \|\| pJob\.stringMains \|\| 'N\/A'\}<\/div>/;
const rep1 = `<div style={{ fontWeight: 600 }}>{pJob.isHybrid ? (pJob.stringCross || pJob.stringMains || 'N/A') : (pJob.stringMains || 'N/A')}</div>`;

const target2 = /<div style=\{\{ fontWeight: 600, color: 'var\(--text-secondary\)' \}\}>@\{pJob\.tensionCross \|\| pJob\.tension\} \{pJob\.tensionUnit \|\| 'Lbs'\}<\/div>/;
const rep2 = `<div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>@{pJob.isHybrid ? (pJob.tensionCross || pJob.tensionMain || pJob.tension) : (pJob.tensionMain || pJob.tension)} {pJob.tensionUnit || 'Lbs'}</div>`;

content = content.replace(target1, rep1).replace(target2, rep2);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed history cross display logic');
