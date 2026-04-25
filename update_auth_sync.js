const fs = require('fs');
let code = fs.readFileSync('web/src/contexts/AuthContext.tsx', 'utf8');

const oldUpdateProfile = `        if (res.ok) {
          const updatedUser = await res.json();
          setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
          return true;
        }`;

const newUpdateProfile = `        if (res.ok) {
          const updatedUser = await res.json();
          setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
          setUsers(prev => prev.map(u => u.id === currentUser?.id ? { ...u, ...updatedUser } : u));
          return true;
        }`;

code = code.replace(oldUpdateProfile, newUpdateProfile);

fs.writeFileSync('web/src/contexts/AuthContext.tsx', code);
console.log('Fixed users array sync');
