const fs = require('fs');
let code = fs.readFileSync('web/src/contexts/AuthContext.tsx', 'utf8');

const oldLogin = `        setCurrentUser(data.user);
        localStorage.setItem('tt_auth_token', data.token);
        return true;`;

const newLogin = `        setCurrentUser(data.user);
        localStorage.setItem('tt_auth_token', data.token);
        
        // Sincronizar o usuário logado com a lista local caso ele não exista nela
        setUsers(prev => {
          if (!prev.find(u => u.email === data.user.email)) {
            return [...prev, data.user];
          }
          return prev;
        });
        
        return true;`;

code = code.replace(oldLogin, newLogin);

fs.writeFileSync('web/src/contexts/AuthContext.tsx', code);
console.log('Fixed login sync');
