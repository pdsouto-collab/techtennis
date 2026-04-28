require('dotenv').config();
const { Client } = require('pg');
const db = new Client({ connectionString: process.env.DATABASE_URL });

db.connect()
  .then(() => db.query('SELECT key, value FROM "SystemSetting" WHERE key = \'appSettings\''))
  .then(res => {
     let val = res.rows[0].value;
     if (typeof val === 'string') val = JSON.parse(val);
     console.log('Clubs in SystemSetting: ' + val.clubs.join(', '));
  })
  .catch(console.error)
  .finally(() => db.end());
