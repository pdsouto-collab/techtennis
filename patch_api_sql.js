const fs = require('fs');
const path = './backend/api/index.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /\$29, \$30, \$31, NOW\(\), NOW\(\)\)/,
  '$29, $30, $31, $32, $33, $34, NOW(), NOW())'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed SQL syntax!');
