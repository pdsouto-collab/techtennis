const fs = require('fs');
const file = 'backend/api/index.js';
let c = fs.readFileSync(file, 'utf8');

const parseFloatOrNull = (v) => {
  return v === '' || v === undefined || v === null ? null : parseFloat(v);
}

// We will inject a parsing helper at the top of the routes or just inside the functions.
// Easier way using regex to replace the POST and PUT bounds!
c = c.replace(/app\.post\('\/api\/rackets', authenticateToken, async \(req, res\) => \{[\s\S]*?\} finally \{\s*await db\.end\(\);\s*\}\s*\}\);/m, 
`app.post('/api/rackets', authenticateToken, async (req, res) => {
    let { customerId, brand, name, identifier, stringPattern, gripSize, sport, notes, weight, balance, length, swingweight, spinweight, twistweight, recoilweight, polarIndex, stiffnessRA, dynamicStiffnessHz, dynamicStiffnessDRA } = req.body;
    const db = getDB();
    try {
      await db.connect();
      
      const parseNum = v => (v === '' || v == null) ? null : parseFloat(v);
      weight = parseNum(weight);
      balance = parseNum(balance);
      length = parseNum(length);
      swingweight = parseNum(swingweight);
      spinweight = parseNum(spinweight);
      twistweight = parseNum(twistweight);
      recoilweight = parseNum(recoilweight);
      polarIndex = parseNum(polarIndex);
      stiffnessRA = parseNum(stiffnessRA);
      dynamicStiffnessHz = parseNum(dynamicStiffnessHz);
      dynamicStiffnessDRA = parseNum(dynamicStiffnessDRA);
      identifier = identifier ? identifier.trim() : '';

      const checkQ = \`SELECT id FROM "RacketItem" WHERE "customerId"=$1 AND "name"=$2 AND coalesce("identifier",'')=$3\`;
      const exists = await db.query(checkQ, [customerId, name, identifier]);
      if (exists.rows.length > 0) {
        return res.status(400).json({ error: 'Uma raquete com este nome e identificador jA existe para este cliente.' });
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
  });`);

c = c.replace(/app\.put\('\/api\/rackets\/:id', authenticateToken, async \(req, res\) => \{[\s\S]*?\} finally \{\s*await db\.end\(\);\s*\}\s*\}\);/m, 
`app.put('/api/rackets/:id', authenticateToken, async (req, res) => {
    let { customerId, brand, name, identifier, stringPattern, gripSize, sport, notes, weight, balance, length, swingweight, spinweight, twistweight, recoilweight, polarIndex, stiffnessRA, dynamicStiffnessHz, dynamicStiffnessDRA } = req.body;
    const db = getDB();
    try {
      await db.connect();
      
      const parseNum = v => (v === '' || v == null) ? null : parseFloat(v);
      weight = parseNum(weight);
      balance = parseNum(balance);
      length = parseNum(length);
      swingweight = parseNum(swingweight);
      spinweight = parseNum(spinweight);
      twistweight = parseNum(twistweight);
      recoilweight = parseNum(recoilweight);
      polarIndex = parseNum(polarIndex);
      stiffnessRA = parseNum(stiffnessRA);
      dynamicStiffnessHz = parseNum(dynamicStiffnessHz);
      dynamicStiffnessDRA = parseNum(dynamicStiffnessDRA);
      identifier = identifier ? identifier.trim() : '';

      const checkQ = \`SELECT id FROM "RacketItem" WHERE "customerId"=$1 AND "name"=$2 AND coalesce("identifier",'')=$3 AND "id" != $4\`;
      const exists = await db.query(checkQ, [customerId, name, identifier, req.params.id]);
      if (exists.rows.length > 0) {
        return res.status(400).json({ error: 'Uma raquete com este nome e identificador jA existe para este cliente.' });
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
  });`);

fs.writeFileSync(file, c);
console.log('Fixed racket backend parsing!');
