const {Client} = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  await client.connect();
  try {
    await client.query(`ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "notes" JSONB DEFAULT '[]'::jsonb;`);
    await client.query(`ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "prepaid" JSONB DEFAULT '[]'::jsonb;`);
    console.log("Columns added successfully to ClientProfile.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
