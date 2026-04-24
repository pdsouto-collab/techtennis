const { Client } = require('pg');

async function execute() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  
  try {
    await c.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "photoUrl" TEXT;`);
    console.log('Coluna photoUrl adicionada em User!');
  } catch(e) { console.error(e); }

  try {
    await c.query(`ALTER TABLE "AgendaSlot" ADD COLUMN IF NOT EXISTS "professorPhotoUrl" TEXT;`);
    console.log('Coluna professorPhotoUrl adicionada em AgendaSlot!');
  } catch(e) { console.error(e); }
  
  await c.end();
}

execute();
