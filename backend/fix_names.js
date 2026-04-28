require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

const db = new Client({ connectionString: process.env.DATABASE_URL });

const csvPath = 'C:\\Users\\silvi\\Downloads\\customers_20260426100215.csv';
const csvData = fs.readFileSync(csvPath, 'utf-8');
const lines = csvData.trim().split('\n');

const mappedIds = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  const values = line.split(';');
  if (values.length < 2) continue;
  
  const idStr = values[0];
  const numericId = parseInt(idStr, 10);
  if (!isNaN(numericId)) mappedIds.push(numericId);
}

db.connect()
  .then(async () => {
    let fixCount = 0;
    
    // Batch process to avoid hitting limits
    for (const numericId of mappedIds) {
       const res = await db.query('SELECT id, name FROM "ClientProfile" WHERE "numericId" = $1', [numericId]);
       if (res.rows.length > 0) {
           const row = res.rows[0];
           const currentName = row.name || '';
           
           // E.g. "Souto Paulo" -> "Paulo Souto"
           // Let's split by space, filtering out double spaces
           const parts = currentName.split(' ').filter(Boolean);
           
           if (parts.length >= 2) {
               // The first word is the Last Name, everything else is first name / middle name
               const lastName = parts[0];
               const rest = parts.slice(1).join(' ');
               const newName = rest + ' ' + lastName;
               
               await db.query('UPDATE "ClientProfile" SET name = $1 WHERE id = $2', [newName, row.id]);
               fixCount++;
           }
       }
    }
    console.log(`Successfully fixed names for ${fixCount} clients.`);
  })
  .catch(console.error)
  .finally(() => db.end());
