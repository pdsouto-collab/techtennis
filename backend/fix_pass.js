const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function fixPassword() {
  try {
    const hashedPassword = await bcrypt.hash('techtennis123', 10);
    const res = await pool.query('UPDATE "User" SET password = $1 WHERE email = $2 RETURNING email, password', [hashedPassword, 'loja@techtennis.com']);
    console.log('Fixed password for:', res.rows[0].email);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

fixPassword();
