const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });
  await client.connect();
  
  console.log('--- Fazendo a atualização de Pontos de Encordoamento ---');
  
  // Atualiza todos os clientes
  const result = await client.query('UPDATE "ClientProfile" SET "stringingPoint"=$1', ['Loja 1 - LaVille Mall']);
  
  // Confirmação
  console.log(`✅ ${result.rowCount} clientes atualizados com o Ponto de Encordoamento 'Loja 1 - LaVille Mall'!`);
  
  await client.end();
}

run();
