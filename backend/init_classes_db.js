const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

async function initDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  try {
    // Drop old ClassSchedule if it exists
    await client.query('DROP TABLE IF EXISTS "ClassSchedule" CASCADE;');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ClassStudent" (
        "id" VARCHAR(255) PRIMARY KEY,
        "professorId" VARCHAR(255),
        "name" VARCHAR(255),
        "phone" VARCHAR(255),
        "condoName" VARCHAR(255),
        "hourlyRate" DECIMAL(10,2),
        "createdAt" VARCHAR(255)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "ClassSchedule" (
        "id" VARCHAR(255) PRIMARY KEY,
        "professorId" VARCHAR(255),
        "studentId" VARCHAR(255),
        "date" VARCHAR(255),
        "timeStart" VARCHAR(255),
        "timeEnd" VARCHAR(255),
        "location" VARCHAR(255),
        "status" VARCHAR(255),
        "willHaveReplacement" BOOLEAN,
        "createdAt" VARCHAR(255)
      );
    `);

    console.log("Database tables initialized for classes!");
  } catch (error) {
    console.error("Error initializing DB:", error);
  } finally {
    await client.end();
  }
}

initDB();
