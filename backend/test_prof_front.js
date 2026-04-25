const { Pool } = require('pg');
require('dotenv').config({path: __dirname + '/.env'});

const db = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
    try {
        await db.connect();
        const body = {
            name: "Kayky Felix Empty",
            email: "kayky@gmail.com",
            phone: "+55 (11) 98405-8007",
            yearsOfExperience: "",
            trainingTypes: "Todos"
        };
        const { name, email, phone, yearsOfExperience, trainingTypes } = body;
        const insertQ = 'INSERT INTO "ProfessorProfile" ("name", "email", "phone", "yearsOfExperience", "trainingTypes") VALUES ($1, $2, $3, $4, $5) RETURNING *';
          
        const result = await db.query(insertQ, [name, email, phone, yearsOfExperience, trainingTypes]);
        console.log("Success:", result.rows[0]);
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await db.end();
    }
})();
