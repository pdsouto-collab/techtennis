require('dotenv').config();
const { Client } = require('pg');
const db = new Client({ connectionString: process.env.DATABASE_URL });

const clubsList = [
"18 do Forte",
"Aldeia da Serra",
"Alpha 2",
"Alpha 6",
"Alpha Conde",
"Alpha Garden",
"Alpha Vitta",
"ATC",
"Boulevard Tamboré",
"Campos do Conde",
"Copper Cotia",
"Ereditá",
"Gênesis 1",
"Gênesis 2",
"Ghaia",
"Gramercy",
"Itaye",
"Level",
"Linguiça TC",
"Melville",
"Newville",
"Parque Barueri",
"Parque Tamboré",
"Penthouse",
"Premium Tamboré",
"Ranking Slice",
"RB",
"Reserva Sant'Ana",
"Resort Tamboré",
"Slice",
"Soho",
"Tamboré 1",
"Tamboré 11",
"Tamboré 3",
"Tamboré 4",
"Tamboré 5",
"Tamboré 6",
"Tamboré 7",
"Tênis Raça",
"Tennis Stuff",
"Trix",
"Valville 1",
"Vila Solaia",
"Wave"
];

const uniqueClubs = [...new Set(clubsList)].sort((a,b) => a.localeCompare(b));

db.connect()
  .then(() => db.query('SELECT value FROM "SystemSetting" WHERE key = \'appSettings\' LIMIT 1'))
  .then(res => {
    let val = res.rows[0].value;
    if (typeof val === 'string') val = JSON.parse(val);
    let settings = val || {};
    let existing = settings.clubs || [];
    let combined = [...new Set([...existing, ...uniqueClubs])].sort((a,b) => a.localeCompare(b));
    settings.clubs = combined;
    if (res.rows.length > 0) {
      return db.query('UPDATE "SystemSetting" SET value = $1 WHERE key = \'appSettings\'', [JSON.stringify(settings)]);
    }
  })
  .then(() => console.log('Clubs updated successfully in SystemSetting'))
  .catch(console.error)
  .finally(() => db.end());
