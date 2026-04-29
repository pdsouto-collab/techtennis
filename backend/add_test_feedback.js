const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function addFeedback() {
  try {
    await pool.query('UPDATE "Job" SET feedback = \'{"power": 4, "control": 5, "spin": 4, "comfort": 3, "tensionMaintenance": 5, "comments": "Ficou ótimo!"}\' WHERE "customerName" LIKE \'%Rafael%\';');
    console.log('Feedback added');
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

addFeedback();
