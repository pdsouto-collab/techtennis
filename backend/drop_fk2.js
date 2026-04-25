const { Client } = require('pg');
require('dotenv').config({path: '.env'});

const db = new Client({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });

async function run() {
    try {
        await db.connect();
        const deleteQ = `ALTER TABLE "Job" DROP CONSTRAINT "Job_commissionedProfessorId_fkey";`;
        await db.query(deleteQ);
        console.log("Successfully dropped foreign key constraint Job_commissionedProfessorId_fkey");
    } catch (err) {
        console.error("CATCHED ERROR:", err.message);
    } finally {
        await db.end();
    }
}
run();
