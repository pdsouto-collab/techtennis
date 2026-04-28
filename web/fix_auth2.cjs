const fs = require('fs');
let file = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

file = file.replace(
  /updateUserStatus: \(id: string, status: User\['status'\], role\?: UserRole\) => void;/g,
  `updateUserStatus: (id: string, status: User['status'], role?: UserRole, numericId?: number) => void;`
);

file = file.replace(
  /const updateUserStatus = \(id: string, status: User\['status'\], role\?: UserRole\) => \{/g,
  `const updateUserStatus = (id: string, status: User['status'], role?: UserRole, numericId?: number) => {`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', file);
console.log('Fixed AuthContext with Regex inside file');
