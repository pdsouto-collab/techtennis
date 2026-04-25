const fs = require('fs');
let c = fs.readFileSync('backend/api/index.js', 'utf8');

const racketRoutes = `
app.post('/api/rackets', authenticateToken, async (req, res) => {
  const { customerId, brand, name, identifier, stringPattern, gripSize, sport, notes, weight, balance, length, swingweight, spinweight, twistweight, recoilweight, polarIndex, stiffnessRA, dynamicStiffnessHz, dynamicStiffnessDRA } = req.body;
  const db = getDB();
  try {
    await db.connect();
    // Validate uniqueness of key (name + identifier) for this customer
    const checkQ = \`SELECT id FROM "RacketItem" WHERE "customerId"=$1 AND "name"=$2 AND coalesce("identifier",'')=$3\`;
    const exists = await db.query(checkQ, [customerId, name, identifier || '']);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Uma raquete com este nome e identificador já existe para este cliente.' });
    }

    const insertQ = \`
      INSERT INTO "RacketItem" ("customerId", "brand", "name", "identifier", "stringPattern", "gripSize", "sport", "notes", "weight", "balance", "length", "swingweight", "spinweight", "twistweight", "recoilweight", "polarIndex", "stiffnessRA", "dynamicStiffnessHz", "dynamicStiffnessDRA")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *
    \`;
    const result = await db.query(insertQ, [customerId, brand, name, identifier, stringPattern, gripSize, sport, notes, weight, balance, length, swingweight, spinweight, twistweight, recoilweight, polarIndex, stiffnessRA, dynamicStiffnessHz, dynamicStiffnessDRA]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar raquete.' });
  } finally {
    await db.end();
  }
});

app.put('/api/rackets/:id', authenticateToken, async (req, res) => {
  const { customerId, brand, name, identifier, stringPattern, gripSize, sport, notes, weight, balance, length, swingweight, spinweight, twistweight, recoilweight, polarIndex, stiffnessRA, dynamicStiffnessHz, dynamicStiffnessDRA } = req.body;
  const db = getDB();
  try {
    await db.connect();
    // Validate uniqueness of key (name + identifier) for this customer, excluding current racket
    const checkQ = \`SELECT id FROM "RacketItem" WHERE "customerId"=$1 AND "name"=$2 AND coalesce("identifier",'')=$3 AND "id" != $4\`;
    const exists = await db.query(checkQ, [customerId, name, identifier || '', req.params.id]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Uma raquete com este nome e identificador já existe para este cliente.' });
    }

    const updateQ = \`
      UPDATE "RacketItem" SET "brand"=$1, "name"=$2, "identifier"=$3, "stringPattern"=$4, "gripSize"=$5, "sport"=$6, "notes"=$7, "weight"=$8, "balance"=$9, "length"=$10, "swingweight"=$11, "spinweight"=$12, "twistweight"=$13, "recoilweight"=$14, "polarIndex"=$15, "stiffnessRA"=$16, "dynamicStiffnessHz"=$17, "dynamicStiffnessDRA"=$18
      WHERE "id"=$19 RETURNING *
    \`;
    const result = await db.query(updateQ, [brand, name, identifier, stringPattern, gripSize, sport, notes, weight, balance, length, swingweight, spinweight, twistweight, recoilweight, polarIndex, stiffnessRA, dynamicStiffnessHz, dynamicStiffnessDRA, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar raquete.' });
  } finally {
    await db.end();
  }
});
`;

c = c.replace(/app\.post\('\/api\/rackets', authenticateToken, async \(req, res\) => \{[\s\S]*?\}\);[\s\n]*app\.put\('\/api\/rackets\/:id', authenticateToken, async \(req, res\) => \{[\s\S]*?\}\);/, racketRoutes);
fs.writeFileSync('backend/api/index.js', c);
