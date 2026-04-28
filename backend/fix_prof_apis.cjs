const fs = require('fs');
let file = fs.readFileSync('api/index.js', 'utf8');

const oldPost = `app.post('/api/professors', authenticateToken, async (req, res) => {
  const { name, email, phone, yearsOfExperience, trainingTypes } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = \`
      INSERT INTO "ProfessorProfile" ("name", "email", "phone", "yearsOfExperience", "trainingTypes")
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    \`;
    const result = await db.query(insertQ, [name, email, phone, yearsOfExperience, trainingTypes]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar professor.' });
  } finally {
    await db.end();
  }
});`;

const newPost = `app.post('/api/professors', authenticateToken, async (req, res) => {
  const { name, email, phone, yearsOfExperience, trainingTypes, numericId } = req.body;
  const db = getDB();
  try {
    await db.connect();
    let numId = numericId;
    if (!numId) {
      const seqRes = await db.query("SELECT nextval('client_numeric_id_seq') AS id");
      numId = seqRes.rows[0].id;
    }
    const insertQ = \`
      INSERT INTO "ProfessorProfile" ("name", "email", "phone", "yearsOfExperience", "trainingTypes", "numericId")
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    \`;
    const result = await db.query(insertQ, [name, email, phone, yearsOfExperience, trainingTypes, numId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar professor.' });
  } finally {
    await db.end();
  }
});`;

const oldPut = `app.put('/api/professors/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, yearsOfExperience, trainingTypes } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = \`
      UPDATE "ProfessorProfile" SET "name"=$1, "email"=$2, "phone"=$3, "yearsOfExperience"=$4, "trainingTypes"=$5
      WHERE "id"=$6 RETURNING *
    \`;
    const result = await db.query(updateQ, [name, email, phone, yearsOfExperience, trainingTypes, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar professor.' });
  } finally {
    await db.end();
  }
});`;

const newPut = `app.put('/api/professors/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, yearsOfExperience, trainingTypes, numericId } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = \`
      UPDATE "ProfessorProfile" SET "name"=$1, "email"=$2, "phone"=$3, "yearsOfExperience"=$4, "trainingTypes"=$5, "numericId"=$6
      WHERE "id"=$7 RETURNING *
    \`;
    const numId = numericId ? parseInt(numericId, 10) : null;
    const result = await db.query(updateQ, [name, email, phone, yearsOfExperience, trainingTypes, numId, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar professor.' });
  } finally {
    await db.end();
  }
});`;

file = file.replace(/app\.post\('\/api\/professors'[\s\S]*?\}\);/, newPost);
file = file.replace(/app\.put\('\/api\/professors\/:id'[\s\S]*?\}\);/, newPut);

fs.writeFileSync('api/index.js', file);
console.log('Fixed API index.js');
