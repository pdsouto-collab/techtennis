const fs = require('fs');
let code = fs.readFileSync('web/src/contexts/AuthContext.tsx', 'utf8');

const oldLogin = `        setCurrentUser(data.user);
        localStorage.setItem('tt_auth_token', data.token);
        return true;`;

const newLogin = `        setCurrentUser(data.user);
        localStorage.setItem('tt_auth_token', data.token);
        
        // Sincronizar o usuário logado com a lista local
        setUsers(prev => {
          if (!prev.find(u => u.email === data.user.email)) {
             return [...prev, data.user];
          }
          return prev.map(u => u.email === data.user.email ? data.user : u);
        });
        
        return true;`;

code = code.replace(oldLogin, newLogin);

const oldUpdateProfile = `        if (res.ok) {
          const updatedUser = await res.json();
          setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
          return true;
        }`;

const newUpdateProfile = `        if (res.ok) {
          const updatedUser = await res.json();
          setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
          setUsers(prev => prev.map(u => u.id === (currentUser?.id || updatedUser.id) ? { ...u, ...updatedUser } : u));
          return true;
        }`;

code = code.replace(oldUpdateProfile, newUpdateProfile);

fs.writeFileSync('web/src/contexts/AuthContext.tsx', code);
console.log('Fixed sync again');
