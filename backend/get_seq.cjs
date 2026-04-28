const { Client } = require('pg');
require('dotenv').config();
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const res = await client.query('SELECT pg_get_serial_sequence(\'"ClientProfile"\', \'numericId\');');
  console.log(res.rows[0]);
  await client.end();
}
run();
