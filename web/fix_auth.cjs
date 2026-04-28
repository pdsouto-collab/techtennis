const fs = require('fs');
let file = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

file = file.replace(
  `registerProfessor: (name: string, email: string, pass: string, phone: string, experience: string, training: string) => void;\n  updateUserStatus: (id: string, status: User['status'], role?: UserRole) => void;`,
  `registerProfessor: (name: string, email: string, pass: string, phone: string, experience: string, training: string) => void;\n  updateUserStatus: (id: string, status: User['status'], role?: UserRole, numericId?: number) => void;`
);

file = file.replace(
  `const updateUserStatus = (id: string, status: User['status'], role?: UserRole) => {`,
  `const updateUserStatus = (id: string, status: User['status'], role?: UserRole, numericId?: number) => {`
);

// also fix the map where mod is created because it needs numericId
file = file.replace(
  `const mod = { ...u, status, ...(role ? { role } : {}) };`,
  `const mod = { ...u, status, ...(role ? { role } : {}), ...(numericId !== undefined ? { numericId } : {}) };`
)

fs.writeFileSync('src/contexts/AuthContext.tsx', file);
console.log('Fixed AuthContext');
