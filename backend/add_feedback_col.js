const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function addFeedbackCol() {
  try {
    const res = await pool.query('ALTER TABLE "Job" ADD COLUMN "feedback" jsonb;');
    console.log('Column feedback added.');
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

addFeedbackCol();
