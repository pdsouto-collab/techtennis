const { Pool } = require('pg');
require('dotenv').config({path: '.env'});

const db = new Pool({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });

db.query('SELECT * FROM "ClientProfile" LIMIT 1')
  .then(r => console.log(r.rows))
  .catch(e => console.error(e))
  .finally(() => db.end());
