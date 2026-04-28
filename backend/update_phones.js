const { Client } = require('pg');

const applyPhoneMask = (val) => {
  if (!val) return '';
  const hasPlus = val.includes('+');
  let v = val.replace(/\D/g, '');
  
  if (!v) return hasPlus ? '+' : '';

  if (!v.startsWith('55') && !hasPlus) {
    v = '55' + v;
  }

  if (v.startsWith('55')) {
    if (v.length <= 2) return `+${v}`;
    if (v.length <= 4) return `+55 (${v.slice(2)}`;
    if (v.length <= 9) return `+55 (${v.slice(2, 4)}) ${v.slice(4)}`;
    v = v.slice(0, 13);
    return `+55 (${v.slice(2, 4)}) ${v.slice(4, 9)}-${v.slice(9)}`;
  } 
  
  if (v.startsWith('1')) {
    if (v.length <= 1) return `+${v}`;
    if (v.length <= 4) return `+1 (${v.slice(1)}`;
    if (v.length <= 7) return `+1 (${v.slice(1, 4)}) ${v.slice(4)}`;
    v = v.slice(0, 11);
    return `+1 (${v.slice(1, 4)}) ${v.slice(4, 7)}-${v.slice(7)}`;
  }

  v = v.slice(0, 15);
  return `+${v}`;
};

async function updateTable(c, tableName) {
  const res = await c.query(`SELECT id, name, phone FROM "${tableName}" WHERE phone IS NOT NULL AND phone != ''`);
  let count = 0;
  
  for (const record of res.rows) {
    const maskedPhone = applyPhoneMask(record.phone);
    if (maskedPhone !== record.phone) {
      await c.query(`UPDATE "${tableName}" SET phone = $1 WHERE id = $2`, [maskedPhone, record.id]);
      count++;
      console.log(`[${tableName}] Updated ${record.name}: ${record.phone} -> ${maskedPhone}`);
    }
  }
  return count;
}

async function main() {
  const c = new Client('postgresql://neondb_owner:npg_R2zJ7rFtOWLZ@ep-shiny-tooth-acb8ili9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  await c.connect();
  
  let totalCount = 0;
  totalCount += await updateTable(c, 'ClientProfile');
  totalCount += await updateTable(c, 'ProfessorProfile');
  totalCount += await updateTable(c, 'User');
  
  console.log(`Finished updating ${totalCount} records.`);
  await c.end();
}

main().catch(console.error);
