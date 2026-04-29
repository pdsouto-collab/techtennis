const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkDB() {
  try {
    const res = await pool.query('SELECT id, name, email FROM "User"');
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

checkDB();
