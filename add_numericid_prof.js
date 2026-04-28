const fs = require('fs');
let sD = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');
sD = sD.replace('<th style={{ padding: \'16px\', fontWeight: 600 }}>Nome</th>', '<th style={{ padding: \'16px\', fontWeight: 600 }}>Nome</th>\n<th style={{ padding: \'16px\', fontWeight: 600 }}>ID Universal</th>');
sD = sD.replace('<td style={{ padding: \'16px\', fontWeight: 600 }}>{prof.name}</td>', '<td style={{ padding: \'16px\', fontWeight: 600 }}>{prof.name}</td>\n<td style={{ padding: \'16px\', color: \'#10B981\', fontWeight: 700 }}>#{prof.numericId || \'N/A\'}</td>');
fs.writeFileSync('web/src/components/StringerDashboard.tsx', sD);
