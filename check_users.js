const { Client } = require('pg');

async function execute() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  const res = await c.query('SELECT name, email, role, status FROM "User"');
  console.log('All Users:', res.rows);
  await c.end();
}

execute();
