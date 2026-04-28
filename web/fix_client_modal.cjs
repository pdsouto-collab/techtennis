const fs = require('fs');
let content = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

// Replace "ID do Cliente" with "ID TechTennis (Automático)"
content = content.replace(/ID do Cliente/g, 'ID TechTennis (Automático)');

fs.writeFileSync('src/components/StringerDashboard.tsx', content);
console.log('Fixed Client Label in StringerDashboard.tsx');
