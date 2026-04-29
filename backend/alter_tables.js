const {Client} = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  await client.connect();
  try {
    await client.query(`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "hasOwnReel" BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "hasOwnSet" BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "pickupNotes" TEXT;`);
    
    await client.query(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "notes" JSONB DEFAULT '[]'::jsonb;`);
    await client.query(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "prepaid" JSONB DEFAULT '[]'::jsonb;`);
    console.log("Columns added successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
