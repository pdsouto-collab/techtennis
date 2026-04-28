const fs = require('fs');
let file = fs.readFileSync('src/components/UserManagement.tsx', 'utf8');

file = file.replace(
  `numericId: fd.get('numericId') ? parseInt(fd.get('numericId') as string, 10) : null`,
  `numericId: fd.get('numericId') ? parseInt(fd.get('numericId') as string, 10) : undefined`
);

fs.writeFileSync('src/components/UserManagement.tsx', file);
console.log('Fixed UserManagement');
