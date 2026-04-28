const { Client } = require('pg');
require('dotenv').config();
async function run() {
  const c = new Client({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });
  await c.connect();
  const res = await c.query('SELECT "professorId", "numericId", "name" FROM "ClientProfile" WHERE "professorId" IS NOT NULL');
  console.log('Clientes com professor: ', res.rows.length);
  await c.end();
}
run();
