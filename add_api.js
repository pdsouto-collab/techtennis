const fs = require('fs');

// 1. Backend: Add PUT /api/users/:id and DELETE /api/users/:id
let apiFile = fs.readFileSync('backend/api/index.js', 'utf8');

const adminUserRoutes = `
// ==========================================
// API RESTful: GERENCIAMENTO DE USUA?RIOS (ADMIN)
// ==========================================

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, role, status, password } = req.body;
  const db = getDB();
  try {
    await db.connect();
    let updateQ;
    let values;
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQ = \`UPDATE "User" SET "name"=$1, "email"=$2, "phone"=$3, "role"=$4, "status"=$5, "password"=$6, "updatedAt"=NOW() WHERE "id"=$7 RETURNING id, name, email, phone, role, status, "photoUrl"\`;
      values = [name, email, phone, role, status, hashedPassword, req.params.id];
    } else {
      updateQ = \`UPDATE "User" SET "name"=$1, "email"=$2, "phone"=$3, "role"=$4, "status"=$5, "updatedAt"=NOW() WHERE "id"=$6 RETURNING id, name, email, phone, role, status, "photoUrl"\`;
      values = [name, email, phone, role, status, req.params.id];
    }
    const result = await db.query(updateQ, values);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    await db.query('DELETE FROM "User" WHERE "id"=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  } finally {
    await db.end();
  }
});

module.exports = app;
`;

apiFile = apiFile.replace('module.exports = app;', adminUserRoutes);
fs.writeFileSync('backend/api/index.js', apiFile);

// 2. Frontend: Update adminUpdateUser and deleteUser in AuthContext.tsx
let authFile = fs.readFileSync('web/src/contexts/AuthContext.tsx', 'utf8');

const newAdminUpdateUser = `  const adminUpdateUser = async (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    try {
      await fetch(\`\${API_URL}/api/users/\${id}\`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('tt_auth_token')}\`
        },
        body: JSON.stringify(updates)
      });
    } catch(e) {
      console.error(e);
    }
  };`;

const oldAdminUpdateUser = `  const adminUpdateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };`;

authFile = authFile.replace(oldAdminUpdateUser, newAdminUpdateUser);

const newDeleteUser = `  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    try {
      await fetch(\`\${API_URL}/api/users/\${id}\`, {
        method: 'DELETE',
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('tt_auth_token')}\` }
      });
    } catch(e) {
      console.error(e);
    }
  };`;

const oldDeleteUser = `  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };`;

authFile = authFile.replace(oldDeleteUser, newDeleteUser);

fs.writeFileSync('web/src/contexts/AuthContext.tsx', authFile);
console.log('Fixed auth DB sync for admin actions!');
