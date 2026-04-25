const { Pool } = require('pg');
require('dotenv').config({path: __dirname + '/.env'});

const db = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
    try {
        await db.connect();
        const result = await db.query("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'ProfessorProfile'");
        console.log(result.rows);
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await db.end();
    }
})();
