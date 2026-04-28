require('dotenv').config();
const { Client } = require('pg');

const db = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

async function runMigrations() {
  try {
    await db.connect();
    
    console.log('Migrating User table...');
    // Add numericId to User if it doesn't exist
    await db.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "numericId" BIGINT;
    `);

    console.log('Migrating ProfessorProfile table...');
    // Add numericId to ProfessorProfile if it doesn't exist
    await db.query(`
      ALTER TABLE "ProfessorProfile" 
      ADD COLUMN IF NOT EXISTS "numericId" BIGINT;
    `);

    console.log('Creating CustomerNote table...');
    // Create CustomerNote Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS "CustomerNote" (
        "id" TEXT PRIMARY KEY,
        "customerNumericId" BIGINT NOT NULL,
        "note" TEXT NOT NULL,
        "author" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating ClassSchedule table...');
    // Create ClassSchedule Table
    // studentNumericId links to ClientProfile
    // professorNumericId links to ProfessorProfile
    await db.query(`
      CREATE TABLE IF NOT EXISTS "ClassSchedule" (
        "id" TEXT PRIMARY KEY,
        "studentNumericId" BIGINT NOT NULL,
        "professorNumericId" BIGINT NOT NULL,
        "date" TEXT NOT NULL,
        "timeStart" TEXT NOT NULL,
        "timeEnd" TEXT NOT NULL,
        "location" TEXT,
        "status" TEXT DEFAULT 'planned',
        "willHaveReplacement" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('All migrations executed successfully!');
  } catch (error) {
    console.error('Migration failed: ', error);
  } finally {
    await db.end();
  }
}

runMigrations();
