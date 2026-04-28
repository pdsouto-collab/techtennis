require('dotenv').config();
const { Client } = require('pg');

const db = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

db.connect()
  .then(async () => {
    const res = await db.query('SELECT id, name FROM "User"'); // fetch all
    console.log(JSON.stringify(res.rows, null, 2));
  })
  .catch(console.error)
  .finally(() => db.end());
