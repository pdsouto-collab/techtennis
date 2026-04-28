const { Client } = require('pg');
require('dotenv').config();
async function run() {
  const c = new Client({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });
  await c.connect();
  const res = await c.query('SELECT "professorId", "numericId", "name" FROM "ClientProfile" WHERE "numericId" IN (103644, 103700, 103636)');
  console.log(res.rows);
  await c.end();
}
run();
