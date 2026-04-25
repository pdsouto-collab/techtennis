const { Client } = require('pg');
require('dotenv').config({path: '.env'});

const db = new Client({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });

async function run() {
    try {
        await db.connect();
        const r = await db.query('SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1', ['Job']);
        console.log(r.rows);
    } catch (err) {
        console.error("CATCHED ERROR:", err.message);
    } finally {
        await db.end();
    }
}
run();
