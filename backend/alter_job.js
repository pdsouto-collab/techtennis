const { Client } = require('pg');

async function exec() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require');
  await c.connect();
  const sql = `
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "isHybrid" BOOLEAN DEFAULT false;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "racketId" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "isStringing" BOOLEAN DEFAULT true;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "stringingType" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "tensionUnit" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "preStretchMain" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "preStretchCross" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "tensionMain" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "tensionCross" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "basePrice" FLOAT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "priceDiscountPercent" FLOAT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "priceDiscountValue" FLOAT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "auxServices" JSONB;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "customerName" TEXT;
  `;
  try {
    await c.query(sql);
    console.log("Successfully altered Job");
  } catch(e) {
    console.error(e);
  }
  await c.end();
}
exec();
