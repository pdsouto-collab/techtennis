const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function init() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // 1. SingleClassProfessorProfile
    await client.query(`
      CREATE TABLE IF NOT EXISTS "SingleClassProfessorProfile" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "professorId" TEXT NOT NULL,
        "name" TEXT,
        "price" NUMERIC,
        "experience" INTEGER,
        "maxDistance" NUMERIC,
        "specialty" TEXT,
        "isOnline" BOOLEAN DEFAULT false,
        "updatedAt" TIMESTAMP DEFAULT now()
      );
    `);
    console.log('Created SingleClassProfessorProfile table');

    // 2. SingleClassMatch
    await client.query(`
      CREATE TABLE IF NOT EXISTS "SingleClassMatch" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "studentId" TEXT NOT NULL,
        "studentName" TEXT,
        "professorId" TEXT NOT NULL,
        "status" TEXT DEFAULT 'pending',
        "objective" TEXT,
        "createdAt" TIMESTAMP DEFAULT now()
      );
    `);
    console.log('Created SingleClassMatch table');

    // 3. ChatMessage
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ChatMessage" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "matchId" UUID NOT NULL REFERENCES "SingleClassMatch"("id") ON DELETE CASCADE,
        "sender" TEXT NOT NULL,
        "text" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT now()
      );
    `);
    console.log('Created ChatMessage table');

  } catch (err) {
    console.error('Error initializing tables', err);
  } finally {
    await client.end();
  }
}

init();
