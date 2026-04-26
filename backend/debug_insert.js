require('dotenv').config();
const { Client } = require('pg');
const db = new Client({ connectionString: process.env.DATABASE_URL });
db.connect()
  .then(() => {
    return db.query(`
      INSERT INTO "Job" 
      ("id", "customerId", "customerNameAlias", "customerName", "racketModel", "type", "tension", "price", "status", "stringMains", "stringCross", "orderCode", "isHybrid", "racketId", "isStringing", "stringingType", "tensionUnit", "preStretchMain", "preStretchCross", "basePrice", "priceDiscountPercent", "priceDiscountValue", "tensionMain", "tensionCross", "pickupDate", "commissionedProfessorId", "auxServices", "date", "stringerName", "createdAt", "updatedAt")
      VALUES
      (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, NOW(), NOW())
    `, ['cid', 'name', 'name', 'model', 'to_string', '', 0, 'aguardando', '', '', 'code', false, 'rid', true, 'atw', 'lbs', 0, 0, 0, 0, 0, 0, 0, '', '', null, '', '']);
  })
  .then(console.log)
  .catch(console.error)
  .finally(() => db.end());
