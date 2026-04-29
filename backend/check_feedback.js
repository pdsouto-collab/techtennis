const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkFeedback() {
  try {
    const res = await pool.query('SELECT id, "customerName", feedback FROM "Job" WHERE "customerName" LIKE \'%Rafael%\';');
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

checkFeedback();
