const { Client } = require('pg');
const connectionString = 'postgresql://neondb_owner:npg_uCgPqV9N1pXY@ep-muddy-bar-a8jlyxst-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';
const client = new Client({ connectionString });

async function run() {
  await client.connect();
  try {
    console.log("Adding numericId to ProfessorProfile...");
    await client.query('ALTER TABLE "ProfessorProfile" ADD COLUMN IF NOT EXISTS "numericId" INTEGER;');
    
    // Attempt to set a shared sequence default. If it fails, that's okay, we handle it in API.
    // Actually we can just handle the sequence strictly in the API layer by calling nextval()
    console.log("Success.");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await client.end();
  }
}
run();
