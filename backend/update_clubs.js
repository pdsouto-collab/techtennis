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

// Deduplicate
const uniqueClubs = [...new Set(clubsList)].sort((a,b) => a.localeCompare(b));

db.connect()
  .then(() => db.query('SELECT value FROM "Setting" WHERE key = \'appSettings\' LIMIT 1'))
  .then(res => {
    let settings = {};
    if (res.rows.length > 0) {
      settings = JSON.parse(res.rows[0].value);
    }
    let existing = settings.clubs || [];
    let combined = [...new Set([...existing, ...uniqueClubs])].sort((a,b) => a.localeCompare(b));
    settings.clubs = combined;
    if (res.rows.length > 0) {
      return db.query('UPDATE "Setting" SET value = $1 WHERE key = \'appSettings\'', [JSON.stringify(settings)]);
    } else {
      return db.query('INSERT INTO "Setting" (id, key, value, "createdAt", "updatedAt") VALUES (gen_random_uuid(), \'appSettings\', $1, NOW(), NOW())', [JSON.stringify(settings)]);
    }
  })
  .then(() => console.log('Clubs updated successfully'))
  .catch(console.error)
  .finally(() => db.end());
