const fs = require('fs');
const path = './web/src/components/ClassManagementProfessor.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix 1: Change green color to match topbar (#3A8E58)
content = content.replace(
  /background: '#10B981', color: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 20px rgba\(16,185,129,0\.2\)'/,
  `background: '#3A8E58', color: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(58,142,88,0.2)'`
);

// Fix 2: Change text to "Horas Realizadas" and make font more readable
content = content.replace(
  /<h3 style=\{\{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', color: 'var\(--text-secondary\)' \}\}>Horas de Aula \(Realizadas\/Retidas\)<\/h3>/,
  `<h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', color: '#6B7280' }}>Horas Realizadas</h3>`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed styling in ClassManagementProfessor.tsx');
