const { Client } = require('pg');

async function execute() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  
  const query = `
    CREATE TABLE IF NOT EXISTS "ManualEntry" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "professorId" TEXT NOT NULL,
      "amount" NUMERIC NOT NULL,
      "date" TEXT,
      "customerName" TEXT,
      "reason" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
  
  try {
    await c.query(query);
    console.log('Tabela ManualEntry criada na nuvem!');
  } catch(e) {
    console.error('Erro na criação de tabela:', e);
  }
  
  await c.end();
}

execute();
