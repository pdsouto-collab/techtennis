const { Client } = require('pg');

async function exec() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require');
  await c.connect();
  const sql = `
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "identifier" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "stringPattern" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "gripSize" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "sport" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "weight" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "balance" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "length" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "swingweight" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "spinweight" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "twistweight" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "recoilweight" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "polarIndex" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "stiffnessRA" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "dynamicStiffnessHz" TEXT;
ALTER TABLE "RacketItem" ADD COLUMN IF NOT EXISTS "dynamicStiffnessDRA" TEXT;
  `;
  try {
    await c.query(sql);
    console.log("Successfully altered RacketItem");
  } catch(e) {
    console.error(e);
  }
  await c.end();
}
exec();
