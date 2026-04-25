const { Client } = require('pg');

async function exec() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require');
  await c.connect();
  const sql = `
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "birthDate" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "cpfCnpj" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "landline" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "cep" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "stringingPoint" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "racketpediaCode" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "customerType" TEXT;
ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "notes" TEXT;
  `;
  try {
    await c.query(sql);
    console.log("Successfully altered ClientProfile");
  } catch(e) {
    console.error(e);
  }
  await c.end();
}
exec();
