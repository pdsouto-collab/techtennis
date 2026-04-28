const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'api', 'index.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update /api/auth/register logic to ALWAYS set status to 'pending'
code = code.replace(
  `const finalStatus = userRole === 'PROFESSOR' ? 'pending' : 'active';`,
  `const finalStatus = 'pending';`
);
// Also ensure numericId is passed if we want, but register doesn't have it yet. It stays null.

// 2. Add GET /api/users
if (!code.includes("app.get('/api/users'")) {
  const usersMarker = "// API RESTful: GERENCIAMENTO DE USUA?RIOS (ADMIN)";
  const usersGetAPI = `
app.get('/api/users', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "User" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuArios.' });
  } finally {
    await db.end();
  }
});
`;
  code = code.replace(usersMarker, usersMarker + "\n" + usersGetAPI);
}

// 3. Update PUT /api/users/:id to accept numericId
if (!code.includes('numericId"=$')) {
  code = code.replace(
    `const { name, email, phone, role, status, password } = req.body;`,
    `const { name, email, phone, role, status, password, numericId } = req.body;`
  );
  code = code.replace(
    `"name"=$1, "email"=$2, "phone"=$3, "role"=$4, "status"=$5, "password"=$6`,
    `"name"=$1, "email"=$2, "phone"=$3, "role"=$4, "status"=$5, "password"=$6, "numericId"=$7`
  );
  code = code.replace(
    `[name, email, phone, role, status, hashedPassword, req.params.id]`,
    `[name, email, phone, role, status, hashedPassword, numericId || null, req.params.id]`
  );
  code = code.replace(
    `"name"=$1, "email"=$2, "phone"=$3, "role"=$4, "status"=$5`,
    `"name"=$1, "email"=$2, "phone"=$3, "role"=$4, "status"=$5, "numericId"=$6`
  );
  code = code.replace(
    `[name, email, phone, role, status, req.params.id]`,
    `[name, email, phone, role, status, numericId || null, req.params.id]`
  );
  // Also fix WHERE id offset
  code = code.replace(`WHERE "id"=$7 RETURNING *`, `WHERE "id"=$8 RETURNING *`);
  code = code.replace(`WHERE "id"=$6 RETURNING *`, `WHERE "id"=$7 RETURNING *`);
}

// 4. Add Notes API
if (!code.includes("app.get('/api/notes/")) {
  const notesAPI = `
// ==========================================
// API RESTful: CUSTOMER NOTES
// ==========================================
app.get('/api/notes/:customerNumericId', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "CustomerNote" WHERE "customerNumericId"=$1 ORDER BY "createdAt" DESC', [req.params.customerNumericId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar notas.' });
  } finally {
    await db.end();
  }
});

app.post('/api/notes', authenticateToken, async (req, res) => {
  const { customerNumericId, note, author } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const crypto = require('crypto');
    const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const insertQ = 'INSERT INTO "CustomerNote" (id, "customerNumericId", note, author) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await db.query(insertQ, [newId, customerNumericId, note, author]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar nota.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    await db.query('DELETE FROM "CustomerNote" WHERE "id"=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar nota.' });
  } finally {
    await db.end();
  }
});
`;
  code += notesAPI;
}

// 5. Add Classes API
if (!code.includes("app.get('/api/classes'")) {
  const classesAPI = `
// ==========================================
// API RESTful: CLASSSCHEDULE
// ==========================================
app.get('/api/classes', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "ClassSchedule" ORDER BY "date" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar aulas.' });
  } finally {
    await db.end();
  }
});

app.post('/api/classes', authenticateToken, async (req, res) => {
  const { studentNumericId, professorNumericId, date, timeStart, timeEnd, location, status, willHaveReplacement } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const crypto = require('crypto');
    const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const insertQ = 'INSERT INTO "ClassSchedule" (id, "studentNumericId", "professorNumericId", "date", "timeStart", "timeEnd", "location", "status", "willHaveReplacement") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
    const result = await db.query(insertQ, [newId, studentNumericId, professorNumericId, date, timeStart, timeEnd, location || null, status || 'planned', willHaveReplacement || false]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar aula.' });
  } finally {
    await db.end();
  }
});

app.put('/api/classes/:id', authenticateToken, async (req, res) => {
  const { studentNumericId, professorNumericId, date, timeStart, timeEnd, location, status, willHaveReplacement } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = 'UPDATE "ClassSchedule" SET "studentNumericId"=$1, "professorNumericId"=$2, "date"=$3, "timeStart"=$4, "timeEnd"=$5, "location"=$6, "status"=$7, "willHaveReplacement"=$8 WHERE id=$9 RETURNING *';
    const result = await db.query(updateQ, [studentNumericId, professorNumericId, date, timeStart, timeEnd, location || null, status || 'planned', willHaveReplacement || false, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar aula.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/classes/:id', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    await db.query('DELETE FROM "ClassSchedule" WHERE "id"=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar aula.' });
  } finally {
    await db.end();
  }
});
`;
  code += classesAPI;
}

fs.writeFileSync(filePath, code);
console.log('API Index updated successfully.');
