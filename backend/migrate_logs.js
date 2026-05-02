require('dotenv').config();
const { Client } = require('pg');

async function migrate() {
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS "SystemLog" (
        "id" SERIAL PRIMARY KEY,
        "action" VARCHAR(50) NOT NULL,
        "resource" VARCHAR(100) NOT NULL,
        "details" TEXT,
        "userName" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Migração concluída: tabela SystemLog criada.');
  } catch(e) {
    console.error('Erro na migração:', e);
  }
  
  await db.end();
}

migrate();
