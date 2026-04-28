const { Client } = require('pg');
require('dotenv').config();
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  try {
    await client.query('ALTER TABLE "ProfessorProfile" ADD COLUMN IF NOT EXISTS "numericId" INTEGER;');
    console.log('Added numericId to ProfessorProfile');
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
