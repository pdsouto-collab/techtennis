const fs = require('fs');
const path = './web/src/components/OrderDetailsView.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /@ \{orderJob\.tensionCross \|\| orderJob\.tension \|\| '\?'\} \{orderJob\.tensionUnit \|\| 'Lbs'\}/g,
  `@ {orderJob.tensionCross || orderJob.tensionMain || orderJob.tension || '?'} {orderJob.tensionUnit || 'Lbs'}`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed tensionCross fallback');
