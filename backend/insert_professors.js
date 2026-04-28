require('dotenv').config();
const { Client } = require('pg');
const crypto = require('crypto');
const db = new Client({ connectionString: process.env.DATABASE_URL });

const professorsList = [
"Abrahan Lincoln",
"Airton",
"Arnaldo Schver",
"Bento Pereira",
"Clayton Felix",
"Diego Fagundes",
"Elmer Pessoa",
"Evandro Gusmão",
"Everton Russo",
"Jacaré",
"Jessé Viana",
"Jonatan Luna",
"Kelvin Oliveira",
"Matheus de Oliveira",
"Nene",
"Nilson",
"Renato",
"Roni",
"Sidnei Edmundo",
"Sidney",
"Tatu",
"Tiago Dutra",
"Walter Azevedo",
"Well Tennis",
"Wellington Dos Santos"
];

// Deduplicate just in case
const uniqueProfessors = [...new Set(professorsList)].sort((a,b) => a.localeCompare(b));

db.connect()
  .then(async () => {
    // Generate an insert query for each
    for (const name of uniqueProfessors) {
       const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}@techtennis.professor`;
       // generate a random password hash or string
       const password = crypto.randomUUID();
       // check if already exists by exact name and role PROFESSOR
       const res = await db.query('SELECT id FROM "User" WHERE name = $1 AND role = \'PROFESSOR\'', [name]);
       if (res.rows.length === 0) {
           await db.query(
             'INSERT INTO "User" (id, name, email, password, role, status, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
             [crypto.randomUUID(), name, email, password, 'PROFESSOR', 'active']
           );
           console.log(`Inserted ${name}`);
       } else {
           console.log(`Skipped ${name} (already exists)`);
       }
    }
  })
  .then(() => console.log('Professors populated successfully'))
  .catch(console.error)
  .finally(() => db.end());
