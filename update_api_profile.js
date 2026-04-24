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
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  } finally {
    await db.end();
  }
});

// ==========================================
// API RESTful: CLIENTES (ClientProfile)
// ==========================================
`;

if (!code.includes('/api/users/profile')) {
  code = code.replace(
    '// ==========================================\n// API RESTful: CLIENTES (ClientProfile)\n// ==========================================',
    profileRoute
  );
}

// Agenda POST replace
code = code.replace(
  'const { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary } = req.body;',
  'const { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary, professorPhotoUrl } = req.body;'
);
code = code.replace(
  '"professorName", "timeAndDay", "region", "price", "type", "trainingTypes", "phone", "resumeSummary"',
  '"professorName", "timeAndDay", "region", "price", "type", "trainingTypes", "phone", "resumeSummary", "professorPhotoUrl"'
);
code = code.replace(
  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
);
code = code.replace(
  'trainingTypes, phone, resumeSummary || \'\'\n    ]);',
  'trainingTypes, phone, resumeSummary || \'\', professorPhotoUrl || \'\'\n    ]);'
);

// Agenda PUT replace
code = code.replace(
  'const { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary } = req.body;',
  'const { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary, professorPhotoUrl } = req.body;'
);
code = code.replace(
  '"resumeSummary"=$8',
  '"resumeSummary"=$8, "professorPhotoUrl"=$9'
);
code = code.replace(
  'WHERE id=$9 RETURNING *',
  'WHERE id=$10 RETURNING *'
);
code = code.replace(
  'resumeSummary || \'\', slotId',
  'resumeSummary || \'\', professorPhotoUrl || \'\', slotId'
);

// update login res to include photoUrl
code = code.replace(
  'const token = jwt.sign(\n      { userId: user.id, email: user.email, role: user.role },',
  'const token = jwt.sign(\n      { userId: user.id, email: user.email, role: user.role, photoUrl: user.photoUrl },'
);

fs.writeFileSync('backend/api/index.js', code);
console.log('backend index.js profile updated!');
