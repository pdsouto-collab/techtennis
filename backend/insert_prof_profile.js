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

const uniqueProfessors = [...new Set(professorsList)].sort((a,b) => a.localeCompare(b));

db.connect()
  .then(async () => {
    for (const name of uniqueProfessors) {
       const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}@techtennis.prof`;
       
       const res = await db.query('SELECT id FROM "ProfessorProfile" WHERE name = $1', [name]);
       if (res.rows.length === 0) {
           await db.query(
             'INSERT INTO "ProfessorProfile" (id, name, email, phone, "yearsOfExperience", "trainingTypes", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, NOW())',
             [crypto.randomUUID(), name, email, '', null, '']
           );
           console.log(`Inserted ${name}`);
       } else {
           console.log(`Skipped ${name} (already exists)`);
       }
    }
  })
  .then(() => console.log('Professors populated into ProfessorProfile successfully'))
  .catch(console.error)
  .finally(() => db.end());
