const { Client } = require('pg');

async function execute() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  
  const query = `
    CREATE TABLE IF NOT EXISTS "ClientProfile" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT NOT NULL,
      "email" TEXT,
      "phone" TEXT,
      "originClub" TEXT,
      "professorId" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "RacketItem" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "customerId" TEXT NOT NULL,
      "brand" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "tension" TEXT,
      "strings" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
  
  try {
    await c.query(query);
    console.log('Tabelas ClientProfile e RacketItem criadas na nuvem!');
  } catch(e) {
    console.error('Erro na criação de tabelas:', e);
  }
  
  await c.end();
}

execute();
