const {Client} = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  await client.connect();
  try {
    await client.query(`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "stringingPoint" TEXT;`);
    console.log("stringingPoint added to Job successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
