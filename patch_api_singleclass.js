const fs = require('fs');
const path = './backend/api/index.js';
let content = fs.readFileSync(path, 'utf8');

const newEndpoints = \`

// --- SINGLE CLASS MATCHMAKING (UBER/TINDER) ---

// Get or create professor profile
app.get('/api/single-class/profile', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "SingleClassProfessorProfile" WHERE "professorId" = $1', [req.user.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json(null);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await db.end();
  }
});

// Update professor profile & go online
app.post('/api/single-class/profile', authenticateToken, async (req, res) => {
  const db = getDB();
  const { price, experience, maxDistance, specialty, isOnline } = req.body;
  try {
    await db.connect();
    // upsert logic
    const check = await db.query('SELECT id FROM "SingleClassProfessorProfile" WHERE "professorId" = $1', [req.user.id]);
    if (check.rows.length > 0) {
      const updateQ = \`
        UPDATE "SingleClassProfessorProfile" 
        SET "price"=$1, "experience"=$2, "maxDistance"=$3, "specialty"=$4, "isOnline"=$5, "updatedAt"=now()
        WHERE "professorId"=$6 RETURNING *
      \`;
      const result = await db.query(updateQ, [price, experience, maxDistance, specialty, isOnline, req.user.id]);
      res.json(result.rows[0]);
    } else {
      const insertQ = \`
        INSERT INTO "SingleClassProfessorProfile" ("professorId", "name", "price", "experience", "maxDistance", "specialty", "isOnline")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      \`;
      const result = await db.query(insertQ, [req.user.id, req.user.name, price, experience, maxDistance, specialty, isOnline]);
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await db.end();
  }
});

// Get online professors for student search
app.get('/api/single-class/search', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    // Return a random online professor
    const result = await db.query('SELECT * FROM "SingleClassProfessorProfile" WHERE "isOnline" = true ORDER BY random() LIMIT 1');
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json(null); // no one online
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await db.end();
  }
});

// Create a match request
app.post('/api/single-class/match', authenticateToken, async (req, res) => {
  const db = getDB();
  const { professorId, objective } = req.body;
  try {
    await db.connect();
    const insertQ = \`
      INSERT INTO "SingleClassMatch" ("studentId", "studentName", "professorId", "objective")
      VALUES ($1, $2, $3, $4) RETURNING *
    \`;
    const result = await db.query(insertQ, [req.user.id, req.user.name, professorId, objective]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await db.end();
  }
});

// Professor gets their pending matches
app.get('/api/single-class/requests', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "SingleClassMatch" WHERE "professorId" = $1 AND "status" = \\'pending\\' ORDER BY "createdAt" DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await db.end();
  }
});

// Accept a match
app.put('/api/single-class/match/:id/accept', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('UPDATE "SingleClassMatch" SET "status" = \\'accepted\\' WHERE "id" = $1 RETURNING *', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await db.end();
  }
});

// Get chat messages for a match
app.get('/api/single-class/chat/:matchId', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "ChatMessage" WHERE "matchId" = $1 ORDER BY "createdAt" ASC', [req.params.matchId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await db.end();
  }
});

// Post chat message
app.post('/api/single-class/chat/:matchId', authenticateToken, async (req, res) => {
  const db = getDB();
  const { text, sender } = req.body;
  try {
    await db.connect();
    const insertQ = \`
      INSERT INTO "ChatMessage" ("matchId", "sender", "text")
      VALUES ($1, $2, $3) RETURNING *
    \`;
    const result = await db.query(insertQ, [req.params.matchId, sender, text]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await db.end();
  }
});

// Check match status for student (polling)
app.get('/api/single-class/match/:id/status', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT "status" FROM "SingleClassMatch" WHERE "id" = $1', [req.params.id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await db.end();
  }
});
\`;

content = content.replace('module.exports = app;', newEndpoints + '\\nmodule.exports = app;');
fs.writeFileSync(path, content, 'utf8');
console.log('Added single class endpoints');
