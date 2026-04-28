require('dotenv').config();
const { Client } = require('pg');

const db = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

db.connect()
  .then(async () => {
    const res = await db.query('SELECT value FROM "SystemSetting" WHERE key = $1', ['appSettings']);
    const clubs = res.rows[0].value.clubs || [];
    
    // Exact mapping requested by user
    const exactMappings = {
      'Genesis 2': 'Gênesis 2',
      'Genesis 1': 'Gênesis 1',
      'Resort Tamboré ': 'Resort Tamboré',
      'Tambore 11': 'Tamboré 11',
      'Tenis Raça': 'Tênis Raça',
      'T3': 'Tamboré 3',
      'Tambore 5': 'Tamboré 5',
      'Resort Tambore': 'Resort Tamboré'
    };

    const knownClubsUpper = new Map();
    clubs.forEach(c => {
       knownClubsUpper.set(c.trim().toUpperCase(), c);
    });

    const clientsRes = await db.query('SELECT id, "originClub" FROM "ClientProfile"');
    
    const dbUpdates = [];

    for (const row of clientsRes.rows) {
       if (!row.originClub) continue;
       
       let current = row.originClub.trim();
       let newVal = current;
       
       if (exactMappings[current]) {
          newVal = exactMappings[current];
       } else if (exactMappings[current.toUpperCase()]) {
          newVal = exactMappings[current.toUpperCase()];
       } 
       else if (knownClubsUpper.has(current.toUpperCase())) {
          newVal = knownClubsUpper.get(current.toUpperCase());
       } 
       else {
          const removedAccents = current.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
          let fallbackMatch = clubs.find(c => c.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() === removedAccents);
          if (fallbackMatch) newVal = fallbackMatch;
       }

       if (newVal !== row.originClub) {
          dbUpdates.push(db.query('UPDATE "ClientProfile" SET "originClub" = $1 WHERE id = $2', [newVal, row.id]));
       }
    }
    
    // Execute all updates
    await Promise.all(dbUpdates);
    
    console.log(`Club names fixed for ${dbUpdates.length} clients.`);
  })
  .catch(console.error)
  .finally(() => db.end());
