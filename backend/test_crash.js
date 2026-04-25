const { Pool } = require('pg');
require('dotenv').config({path: '.env'});

const db = new Pool({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });

async function run() {
    try {
        await db.connect();
        const insertQ = `
        INSERT INTO "ClientProfile" ("name", "professorId")
        VALUES ($1, $2) RETURNING *
      `;
        const result = await db.query(insertQ, ["test", undefined]);
        console.log(result);
    } catch (err) {
        console.error("CATCHED ERROR:", err.message);
    } finally {
        await db.end();
    }
}
run();
