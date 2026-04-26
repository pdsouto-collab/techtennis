require('dotenv').config();
const { Client } = require('pg');
const db = new Client({ connectionString: process.env.DATABASE_URL });
db.connect()
  .then(() => db.query('ALTER TABLE "Job" ADD COLUMN "stringerName" TEXT;'))
  .then(() => console.log('Done'))
  .catch(console.error)
  .finally(() => db.end());
