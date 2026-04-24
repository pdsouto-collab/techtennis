const { Client } = require('pg');

async function execute() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  
  const query = `
    CREATE TABLE IF NOT EXISTS "AgendaSlot" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "professorName" TEXT NOT NULL,
      "timeAndDay" TEXT NOT NULL,
      "region" TEXT NOT NULL,
      "price" TEXT,
      "type" TEXT NOT NULL,
      "trainingTypes" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
  
  try {
    await c.query(query);
    console.log('Tabela AgendaSlot criada com sucesso!');
  } catch(e) {
    console.error('Erro:', e);
  }
  
  await c.end();
}

execute();
