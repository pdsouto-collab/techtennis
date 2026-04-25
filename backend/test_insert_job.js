const { Client } = require('pg');
require('dotenv').config({path: '.env'});

const db = new Client({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });

async function run() {
    try {
        await db.connect();
        const insertQ = `
          INSERT INTO "Job" 
          ("id", "customerId", "customerNameAlias", "customerName", "racketModel", "type", "tension", "price", "status", "stringMains", "stringCross", "orderCode", "isHybrid", "racketId", "isStringing", "stringingType", "tensionUnit", "preStretchMain", "preStretchCross", "basePrice", "priceDiscountPercent", "priceDiscountValue", "tensionMain", "tensionCross", "pickupDate", "commissionedProfessorId", "auxServices", "createdAt", "updatedAt")
          VALUES 
          (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'aguardando', $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, NOW(), NOW())
          RETURNING *
        `;
        const result = await db.query(insertQ, [
          "temp", 'Desconhecido', 'Desconhecido', 'N/A', 'to_string', '', null, '', '', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
        ]);
        console.log("Success:", result.rows[0].id);
    } catch (err) {
        console.error("CATCHED ERROR:", err.message);
    } finally {
        await db.end();
    }
}
run();
