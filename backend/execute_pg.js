const { Client } = require('pg');

async function execute() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  
  const query = `
    CREATE TABLE IF NOT EXISTS "ProfessorProfile" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT NOT NULL,
      "email" TEXT,
      "phone" TEXT,
      "yearsOfExperience" TEXT,
      "trainingTypes" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "SystemSetting" (
      "key" TEXT PRIMARY KEY,
      "value" JSONB NOT NULL,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
  
  try {
    await c.query(query);
    console.log('Tabelas ProfessorProfile e SystemSetting criadas na nuvem!');
  } catch(e) {
    console.error('Erro na criação de tabelas:', e);
  }
  
  await c.end();
}

execute();
