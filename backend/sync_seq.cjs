const { Client } = require('pg');
require('dotenv').config();
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  const resClient = await client.query('SELECT MAX("numericId") as max_client FROM "ClientProfile"');
  const resProf = await client.query('SELECT MAX("numericId") as max_prof FROM "ProfessorProfile"');
  let mClient = parseInt(resClient.rows[0].max_client || 0, 10);
  let mProf = parseInt(resProf.rows[0].max_prof || 0, 10);
  let maxId = Math.max(mClient, mProf);
  
  if (maxId < 163748) maxId = 163748; // Ensure it starts from at least the user's estimated max
  
  const nextVal = maxId + 1;
  console.log(`Setting sequence next val to ${nextVal}`);
  await client.query(`ALTER SEQUENCE client_numeric_id_seq RESTART WITH ${nextVal};`);
  console.log("Sequence restarted successfully.");

  // Also replace airton's 100001 with nextVal to fix him specifically ? Actually wait, if we leave it at 100001, it might collide in the future? No, sequence is jumping over it. But we can update Airton directly too.
  const airtonUpdate = await client.query(`UPDATE "ProfessorProfile" SET "numericId" = ${nextVal} WHERE "numericId" = 100001 RETURNING *`);
  if (airtonUpdate.rowCount > 0) {
    console.log("Updated Airton to " + nextVal + ". Incrementing sequence again.");
    await client.query(`ALTER SEQUENCE client_numeric_id_seq RESTART WITH ${nextVal + 1};`);
  }

  await client.end();
}
run();
