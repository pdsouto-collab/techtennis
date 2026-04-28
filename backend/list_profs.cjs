const { Client } = require('pg');
require('dotenv').config();
async function run() {
  const c = new Client({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });
  await c.connect();
  const res = await c.query("SELECT name FROM \"User\" WHERE role='PROFESSOR'");
  console.log(res.rows.map(r => r.name));
  await c.end();
}
run();
