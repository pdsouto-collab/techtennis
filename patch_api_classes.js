const fs = require('fs');
const path = './backend/api/index.js';
let content = fs.readFileSync(path, 'utf8');

const newEndpoints = `
// --- CLASS STUDENTS ---
app.get('/api/class-students', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "ClassStudent"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar alunos de aula.' });
  } finally {
    await db.end();
  }
});

app.post('/api/class-students', authenticateToken, async (req, res) => {
  const { id, professorId, name, phone, condoName, hourlyRate, createdAt } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = \`
      INSERT INTO "ClassStudent" ("id", "professorId", "name", "phone", "condoName", "hourlyRate", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    \`;
    const result = await db.query(insertQ, [id, professorId, name, phone, condoName, hourlyRate, createdAt]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar aluno.' });
  } finally {
    await db.end();
  }
});

app.put('/api/class-students/:id', authenticateToken, async (req, res) => {
  const { professorId, name, phone, condoName, hourlyRate } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = \`
      UPDATE "ClassStudent" SET "professorId"=$1, "name"=$2, "phone"=$3, "condoName"=$4, "hourlyRate"=$5
      WHERE "id"=$6 RETURNING *
    \`;
    const result = await db.query(updateQ, [professorId, name, phone, condoName, hourlyRate, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar aluno.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/class-students/:id', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    await db.query('DELETE FROM "ClassStudent" WHERE "id"=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir aluno.' });
  } finally {
    await db.end();
  }
});

// --- CLASS SCHEDULES ---
app.get('/api/classes', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "ClassSchedule"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar aulas.' });
  } finally {
    await db.end();
  }
});

app.post('/api/classes', authenticateToken, async (req, res) => {
  const { id, professorId, studentId, date, timeStart, timeEnd, location, status, willHaveReplacement, createdAt } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = \`
      INSERT INTO "ClassSchedule" ("id", "professorId", "studentId", "date", "timeStart", "timeEnd", "location", "status", "willHaveReplacement", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    \`;
    const result = await db.query(insertQ, [id, professorId, studentId, date, timeStart, timeEnd, location, status, willHaveReplacement, createdAt]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar aula.' });
  } finally {
    await db.end();
  }
});

app.put('/api/classes/:id', authenticateToken, async (req, res) => {
  const { professorId, studentId, date, timeStart, timeEnd, location, status, willHaveReplacement } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = \`
      UPDATE "ClassSchedule" SET "professorId"=$1, "studentId"=$2, "date"=$3, "timeStart"=$4, "timeEnd"=$5, "location"=$6, "status"=$7, "willHaveReplacement"=$8
      WHERE "id"=$9 RETURNING *
    \`;
    const result = await db.query(updateQ, [professorId, studentId, date, timeStart, timeEnd, location, status, willHaveReplacement, req.params.id]);
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
    res.status(500).json({ error: 'Erro ao excluir aula.' });
  } finally {
    await db.end();
  }
});

module.exports = app;
`;

content = content.replace('module.exports = app;', newEndpoints);
fs.writeFileSync(path, content, 'utf8');
console.log('Added class endpoints to api/index.js');
