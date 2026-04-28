require('dotenv').config();
const { Client } = require('pg');
const db = new Client({ connectionString: process.env.DATABASE_URL });

db.connect()
  .then(async () => {
    await db.query(`CREATE SEQUENCE IF NOT EXISTS client_numeric_id_seq START 100000`);
    await db.query(`ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "numericId" INTEGER DEFAULT nextval('client_numeric_id_seq')`);
    console.log('Added numericId to ClientProfile');
  })
  .catch(console.error)
  .finally(() => db.end());
