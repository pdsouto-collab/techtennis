const { Pool } = require('pg');
require('dotenv').config({path: __dirname + '/.env'});

const db = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
    try {
        await db.connect();
        const result = await db.query('SELECT * FROM "ProfessorProfile" ORDER BY "createdAt" DESC');
        console.log(result.rows);
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await db.end();
    }
})();
