require('dotenv').config();
const { Client } = require('pg');

const db = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

db.connect()
  .then(async () => {
    const profRes = await db.query('SELECT id FROM "ProfessorProfile" WHERE name = $1', ['Kayky Felix dos Santos']);
    if (profRes.rows.length > 0) {
      const profId = profRes.rows[0].id;
      await db.query('UPDATE "ClientProfile" SET "professorId" = $1 WHERE "numericId" = 162311', [profId]);
      console.log('Fixed Kayky!');
    } else {
      console.log('Kayky not found in ProfessorProfile either.');
    }
  })
  .catch(console.error)
  .finally(() => db.end());
