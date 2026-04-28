require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const db = new Client({ connectionString: process.env.DATABASE_URL });

const csvPath = 'C:\\Users\\silvi\\Downloads\\customers_20260426100215.csv';
const csvData = fs.readFileSync(csvPath, 'utf-8');
const lines = csvData.trim().split('\n');

const headers = lines[0].split(';');

const customersToInsert = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  const values = line.split(';');
  if (values.length < 2) continue;
  
  const idStr = values[0];
  const numericId = parseInt(idStr, 10);
  const name = values[1] ? values[1].replace(/"/g, '').trim() : '';
  const gender = values[2] || '';
  const taxCode = values[3] || '';
  const vatNumber = values[4] || '';
  const businessName = values[5] || '';
  const sdi = values[6] || '';
  const birthday = values[7] || '';
  const email = values[8] || '';
  const phone = values[9] || '';
  const mobile = values[10] || '';
  const notes = values[11] || '';
  const referrerClub = values[12] || '';
  const referrerCoach = values[13] || '';
  
  customersToInsert.push({ numericId, name, gender, taxCode, vatNumber, businessName, sdi, birthday, email, phone, mobile, notes, referrerClub, referrerCoach });
}

db.connect()
  .then(async () => {
     await db.query(`ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS gender TEXT`);
     
     let insertedCount = 0;
     for (const c of customersToInsert) {
       if (isNaN(c.numericId)) continue;
       const check = await db.query('SELECT id FROM "ClientProfile" WHERE "numericId" = $1', [c.numericId]);
       if (check.rows.length === 0) {
           await db.query(`
             INSERT INTO "ClientProfile" 
             (id, "createdAt", "numericId", "name", "gender", "cpfCnpj", "birthDate", "email", "landline", "phone", "notes", "originClub")
             VALUES (gen_random_uuid(), NOW(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           `, [
             c.numericId, c.name, c.gender, c.taxCode, c.birthday, c.email, c.phone, c.mobile, 
             [c.notes, c.businessName, c.vatNumber, c.sdi].filter(Boolean).join(' | '),
             c.referrerClub
           ]);
           insertedCount++;
       }
     }
     console.log(`Successfully inserted ${insertedCount} new clients.`);
  })
  .catch(console.error)
  .finally(() => db.end());
