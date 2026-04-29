const fs = require('fs');
const path = './web/src/components/OrderDetailsView.tsx';
let content = fs.readFileSync(path, 'utf8');

const regexCross = /<div>\s*<div style=\{\{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' \}\}>\{orderJob\.stringCross \|\| orderJob\.crossString \|\| orderJob\.stringMains \|\| orderJob\.mainString \|\| 'Não definido'\}<\/div>\s*<div style=\{\{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 \}\}>@ \{orderJob\.tensionCross \|\| orderJob\.tensionMain \|\| orderJob\.tension \|\| '\?'\} \{orderJob\.tensionUnit \|\| 'Lbs'\}<\/div>\s*<\/div>/;

const replacementCross = `<div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
                    {orderJob.isHybrid ? (orderJob.stringCross || orderJob.crossString || orderJob.stringMains || orderJob.mainString || 'Não definido') : (orderJob.stringMains || orderJob.mainString || 'Não definido')}
                  </div>
                  <div style={{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>
                    @ {orderJob.isHybrid ? (orderJob.tensionCross || orderJob.tensionMain || orderJob.tension || '?') : (orderJob.tensionMain || orderJob.tension || '?')} {orderJob.tensionUnit || 'Lbs'}
                  </div>
                </div>`;

content = content.replace(regexCross, replacementCross);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed OrderDetailsView cross fields logic!');
