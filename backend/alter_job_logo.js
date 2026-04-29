const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    await client.query(`
      ALTER TABLE "Job" 
      ADD COLUMN IF NOT EXISTS "hasLogo" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "logoNotes" TEXT,
      ADD COLUMN IF NOT EXISTS "racketNotes" TEXT
    `);

    console.log("Job table altered successfully with hasLogo, logoNotes, and racketNotes.");
  } catch (err) {
    console.error("Error altering Job table", err);
  } finally {
    await client.end();
  }
}

run();
