const { Client } = require('pg');

async function execute() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  
  const query = `
    ALTER TABLE "AgendaSlot" ADD COLUMN IF NOT EXISTS "resumeSummary" TEXT;
  `;
  
  try {
    await c.query(query);
    console.log('Coluna resumeSummary adicionada em AgendaSlot com sucesso!');
  } catch(e) {
    console.error('Erro ao adicionar coluna:', e);
  }
  
  await c.end();
}

execute();
