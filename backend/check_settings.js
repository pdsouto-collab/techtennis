require('dotenv').config();
const { Client } = require('pg');
const db = new Client({ connectionString: process.env.DATABASE_URL });

db.connect()
  .then(() => db.query('SELECT value FROM "Setting" WHERE key = \'appSettings\''))
  .then(res => {
     let val = JSON.parse(res.rows[0].value);
     let clubsStr = val.clubs.join(', ');
     console.log('Clubs: ' + clubsStr);
  })
  .catch(console.error)
  .finally(() => db.end());
