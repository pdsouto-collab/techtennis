const { Client } = require('pg');
require('dotenv').config();
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  const res = await client.query('SELECT name, "professorId", "originClub" FROM "ClientProfile" LIMIT 5;');
  console.log(res.rows);
  await client.end();
}
run();
