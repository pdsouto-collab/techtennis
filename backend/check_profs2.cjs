const { Client } = require('pg');
require('dotenv').config();
async function run() {
  const c = new Client({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });
  await c.connect();
  const res = await c.query("SELECT name FROM \"User\" WHERE id='1ff10891-0e08-465c-a5dd-b5c202160f8b'");
  console.log(res.rows);
  await c.end();
}
run();
