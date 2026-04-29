const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkUserLink() {
  try {
    const res = await pool.query(`SELECT id, name, email, role, "numericId" FROM "User" WHERE email='rafa@techtennis.com'`);
    console.table(res.rows);
    
    if (res.rows.length > 0) {
      const numId = res.rows[0].numericId;
      console.log('Searching for Customer with numericId:', numId);
      const cust = await pool.query(`SELECT id, name, "numericId" FROM "Customer" WHERE "numericId"=$1`, [numId]);
      console.table(cust.rows);
      
      console.log('Searching for Customer by name Rafael Cliente');
      const cust2 = await pool.query(`SELECT id, name, "numericId" FROM "Customer" WHERE name ILIKE '%Rafael Cliente%'`);
      console.table(cust2.rows);
    }
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

checkUserLink();
