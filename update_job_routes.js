const fs = require('fs');

const file = 'backend/api/index.js';
let c = fs.readFileSync(file, 'utf8');

const newRoutes = `
app.post('/api/jobs', authenticateToken, async (req, res) => {
  const { customerId, customerName, racketModel, type, tension, price, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices } = req.body;
  const db = getDB();
  try {
    await db.connect();
    // Validate customerId - frontend may leave it empty sometimes, fallback
    const cId = customerId || 'temp_cust_id';
    
    // In db, fields are: id, customerId, customerNameAlias, racketModel, type, tension, price, status, stringMains, stringCross, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices
    const insertQ = \`
      INSERT INTO "Job" 
      ("id", "customerId", "customerNameAlias", "customerName", "racketModel", "type", "tension", "price", "status", "stringMains", "stringCross", "orderCode", "isHybrid", "racketId", "isStringing", "stringingType", "tensionUnit", "preStretchMain", "preStretchCross", "basePrice", "priceDiscountPercent", "priceDiscountValue", "tensionMain", "tensionCross", "pickupDate", "commissionedProfessorId", "auxServices", "createdAt", "updatedAt")
      VALUES 
      (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'aguardando', $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, NOW(), NOW())
      RETURNING *
    \`;
    const result = await db.query(insertQ, [
      cId, customerName || 'Desconhecido', customerName || 'Desconhecido', racketModel || 'N/A', type || 'to_string', tension || '', price || 0, mainString || '', crossString || '', orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar o serviA o.' });
  } finally {
    await db.end();
  }
});

app.put('/api/jobs/:id', authenticateToken, async (req, res) => {
  const { customerId, customerName, racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices } = req.body;
  const db = getDB();
  try {
    await db.connect();
    
    // Some basic validation for customerId if empty
    const cId = customerId || 'temp_cust_id';
    
    const updateQ = \`
      UPDATE "Job" SET 
        "customerId" = $1, "customerNameAlias" = $2, "customerName" = $3, "racketModel" = $4, "type" = $5, "tension" = $6, "price" = $7, "status" = COALESCE($8, "status"), "stringMains" = $9, "stringCross" = $10, "orderCode" = $11, "isHybrid" = $12, "racketId" = $13, "isStringing" = $14, "stringingType" = $15, "tensionUnit" = $16, "preStretchMain" = $17, "preStretchCross" = $18, "basePrice" = $19, "priceDiscountPercent" = $20, "priceDiscountValue" = $21, "tensionMain" = $22, "tensionCross" = $23, "pickupDate" = $24, "commissionedProfessorId" = $25, "auxServices" = $26, "updatedAt" = NOW()
      WHERE "id" = $27
      RETURNING *
    \`;
    const result = await db.query(updateQ, [
      cId, customerName || 'Desconhecido', customerName || 'Desconhecido', racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, req.params.id
    ]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'ServiA o nAo encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar o Job.' });
  } finally {
    await db.end();
  }
});
`;

// Replace specifically from app.post('/api/jobs' to the end of app.put('/api/jobs/:id/status'
// We will replace app.post('/api/jobs') entirely.
c = c.replace(/app\.post\('\/api\/jobs'[\s\S]*?app\.put\('\/api\/jobs\/:id\/status'[^}]+\}[^}]+\}\);/, newRoutes + `\n\napp.put('/api/jobs/:id/status', authenticateToken, async (req, res) => {
    const { status } = req.body;
    const jobId = req.params.id;
    const db = getDB();
    try {
      await db.connect();
      const updateQ = \`UPDATE "Job" SET "status"=$1, "updatedAt"=NOW() WHERE id=$2 RETURNING *\`;
      const result = await db.query(updateQ, [status, jobId]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'ServiÃ§o nÃ£o encontrado.' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar status do Job.' });
    } finally {
      await db.end();
    }
  });`);

fs.writeFileSync(file, c);
console.log('Jobs API Updated!');
