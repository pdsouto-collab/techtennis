const fs = require('fs');
let code = fs.readFileSync('backend/api/index.js', 'utf8');

const profileRoute = `
// ==========================================
// API RESTful: PERFIL DO USUÁRIO
// ==========================================

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  const { name, phone, photoUrl } = req.body;
  const userId = req.user.userId;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = \`
      UPDATE "User"
      SET "name"=$1, "phone"=$2, "photoUrl"=$3, "updatedAt"=NOW()
      WHERE "id"=$4
      RETURNING id, name, email, phone, role, status, "photoUrl"
    \`;
    const result = await db.query(updateQ, [name, phone, photoUrl || '', userId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Perfil Update Error:', err);
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  } finally {
    await db.end();
  }
});
`;

if (!code.includes('/api/users/profile')) {
  code = code.replace('module.exports = app;', profileRoute + '\n\nmodule.exports = app;');
  fs.writeFileSync('backend/api/index.js', code);
  console.log('Profile route injected!');
} else {
  console.log('Profile route already exists.');
}
