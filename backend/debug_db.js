require('dotenv').config();
const { Client } = require('pg');
const db = new Client({ connectionString: process.env.DATABASE_URL });
db.connect()
  .then(() => db.query('SELECT "customerName", "stringMains", "stringCross", "stringerName", "tension", "commissionedProfessorId" FROM "Job" WHERE "customerName" = \'Paulo Souto\' ORDER BY "createdAt" DESC LIMIT 5'))
  .then(res => console.log(JSON.stringify(res.rows, null, 2)))
  .catch(console.error)
  .finally(() => db.end());
