const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function execute() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  const hash = await bcrypt.hash('123', 10);
  const idStr = Date.now().toString();
  await c.query(`INSERT INTO "User" (id, name, email, password, phone, role, status, "createdAt", "updatedAt") VALUES ($1, 'Ernesto Mori', 'ernestomori@gmail.com', $2, '+5511971100706', 'ADMIN', 'active', NOW(), NOW())`, [idStr, hash]);
  console.log('Ernesto Inserido!');
  await c.end();
}

execute();
