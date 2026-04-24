const { Client } = require('pg');

async function promote() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  const res = await c.query("SELECT email FROM \"User\"");
  console.log('Usuarios found:', res.rows);
  await c.end();
}

promote().catch(console.error);
