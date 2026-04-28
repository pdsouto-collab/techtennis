const fs = require('fs');

let file = fs.readFileSync('api/index.js', 'utf8');

const oldPost = `app.post('/api/customers', authenticateToken, async (req, res) => {
  const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = \`
      INSERT INTO "ClientProfile" ("name", "email", "phone", "originClub", "professorId", "birthDate", "cpfCnpj", "landline", "address", "cep", "city", "country", "stringingPoint", "racketpediaCode", "customerType", "notes")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *
    \`;
    const result = await db.query(insertQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar cliente.' });
  } finally {
    await db.end();
  }
});`;

const newPost = `app.post('/api/customers', authenticateToken, async (req, res) => {
  const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numericId } = req.body;
  const db = getDB();
  try {
    await db.connect();
    let numId = numericId ? parseInt(numericId, 10) : null;
    if (!numId) {
      const seqRes = await db.query("SELECT nextval('client_numeric_id_seq') AS id");
      numId = seqRes.rows[0].id;
    }
    const insertQ = \`
      INSERT INTO "ClientProfile" ("name", "email", "phone", "originClub", "professorId", "birthDate", "cpfCnpj", "landline", "address", "cep", "city", "country", "stringingPoint", "racketpediaCode", "customerType", "notes", "numericId")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *
    \`;
    const result = await db.query(insertQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar cliente.' });
  } finally {
    await db.end();
  }
});`;

const oldPut = `app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = \`
      UPDATE "ClientProfile" SET "name"=$1, "email"=$2, "phone"=$3, "originClub"=$4, "professorId"=$5, "birthDate"=$6, "cpfCnpj"=$7, "landline"=$8, "address"=$9, "cep"=$10, "city"=$11, "country"=$12, "stringingPoint"=$13, "racketpediaCode"=$14, "customerType"=$15, "notes"=$16
      WHERE "id"=$17 RETURNING *
    \`;
    const result = await db.query(updateQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  } finally {
    await db.end();
  }
});`;

const newPut = `app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numericId } = req.body;
  const db = getDB();
  try {
    await db.connect();
    let numId = numericId ? parseInt(numericId, 10) : null;
    if (!numId) {
      const seqRes = await db.query("SELECT nextval('client_numeric_id_seq') AS id");
      numId = seqRes.rows[0].id;
    }
    const updateQ = \`
      UPDATE "ClientProfile" SET "name"=$1, "email"=$2, "phone"=$3, "originClub"=$4, "professorId"=$5, "birthDate"=$6, "cpfCnpj"=$7, "landline"=$8, "address"=$9, "cep"=$10, "city"=$11, "country"=$12, "stringingPoint"=$13, "racketpediaCode"=$14, "customerType"=$15, "notes"=$16, "numericId"=$17
      WHERE "id"=$18 RETURNING *
    \`;
    const result = await db.query(updateQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  } finally {
    await db.end();
  }
});`;

// Replace ignoring minor whitespace differences
function stripWS(s) { return s.replace(/\s+/g, ''); }

let strippedFile = stripWS(file);
if (strippedFile.includes(stripWS(oldPost)) && strippedFile.includes(stripWS(oldPut))) {
  // Use regex for robust replacement
  file = file.replace(/app\.post\('\/api\/customers'[\s\S]*?\}\);/, newPost);
  file = file.replace(/app\.put\('\/api\/customers\/:id'[\s\S]*?\}\);/, newPut);
  fs.writeFileSync('api/index.js', file);
  console.log('Fixed API customers');
} else {
  console.log('Blocks not found');
}
