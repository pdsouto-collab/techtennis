const fs = require('fs');
let c = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');

const s = c.indexOf('{/* Modal Body */}', c.indexOf('isRacketModalOpen &&'));
const e = c.indexOf('{/* Racket History Modal */}', s);

fs.writeFileSync('RacketModalExtract.txt', c.substring(s, e));
