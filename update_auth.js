const fs = require('fs');
let code = fs.readFileSync('web/src/contexts/AuthContext.tsx', 'utf8');

// add User photoUrl interface
if (!code.includes('photoUrl?: string;')) {
  code = code.replace(
    '  trainingTypes?: string;',
    '  trainingTypes?: string;\n  photoUrl?: string;'
  );
}

// add updateProfile to AuthContextType
if (!code.includes('updateProfile:')) {
  code = code.replace(
    '  adminUpdateUser: (id: string, updates: Partial<User>) => void;',
    '  adminUpdateUser: (id: string, updates: Partial<User>) => void;\n  updateProfile: (updates: Partial<User>) => Promise<boolean>;'
  );
}

// implement updateProfile
const func = `
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      const res = await fetch(\`\${API_URL}/api/users/profile\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('tt_auth_token')}\`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
        return true;
      }
      return false;
    } catch(e) {
      console.error(e);
      return false;
    }
  };

  return (
`;
if (!code.includes('const updateProfile = async')) {
  code = code.replace('  return (', func);
}

// export updateProfile in Provider
code = code.replace(
  'updateUserStatus, deleteUser, adminCreateUser, adminUpdateUser }}',
  'updateUserStatus, deleteUser, adminCreateUser, adminUpdateUser, updateProfile }}'
);

fs.writeFileSync('web/src/contexts/AuthContext.tsx', code);
console.log('AuthContext updated!');
