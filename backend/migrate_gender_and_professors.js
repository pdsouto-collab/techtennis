require('dotenv').config();
const { Client } = require('pg');

const updatesProfessors = {
  "Bento": [103644,103700,103703,103775,103780,103786,103787,103923,104293,104696,121298,126673,127125,128035,128292,128909,128912,130484,131140,131422,131680,132245,139567,139710,140156,141600],
  "Clayton": [103636,103638,103702,103708,103714,103772,103781,103880,104005,104058,104059,104094,104504,106021,118223,119020,120188,120888,121297,122692,122694,124835,125950,125951,126801,127127,127781,127782,127954,128290,132248,134338,136474,136543,138985],
  "Diego Fagundes": [120042,122320],
  "Elmer Pessoa": [137636,139607],
  "Evandro Gusmão": [103635,103666,103784,103785,103885,104050,121822,122417,128136,128911,134786,136336,156131,163083],
  "Jacaré": [132771],
  "Jessé Viana": [103642,103643,103881,103882,103886,119891,121064,125952,134607,135557,136033,141526,162640],
  "Jonatan Luna": [103779,128910],
  "Kayky Felix dos Santos": [162311],
  "Kelvin Oliveira": [104017,104018,104035,121344,121364,121560,121561,121562,125476,126973,127862,128660,129378,129379,130011,130012,135553,136887,140157,143955,148307],
  "Matheus de Oliveira": [160636,160950,163704],
  "Nene": [142714,145039,145040,145414],
  "Nilson": [104986],
  "Renato": [106180,143045,143954,145535,148095,153156,155708,160948,161736,162355,162411,162749],
  "Roni": [123807],
  "Sidnei Edmundo": [126804,127261,127415,127433,127434,127591,127592,127593,127620,127621,127622,127863,128133,128135,128407,128615,129195,130008,130504,131801,132880,133972,134109,138117,138118,138602,139612,139709,141601,141603,142705,143956,144234,152791,154547,160944,163748],
  "Sidney": [126073,126557],
  "Tatu": [103701,103713,103773,103826,104016,104033,104047,104056,104693,104899,105494,105895,105921,118229,120136,121004,122055,122690,122691,122696,123001,123211,124992,125174,128134,128616,129381,132501,135556,138421,138422,139608,139609,140159,141263,142717,142718,142722,145415,152688,152689,152747,153761,159869,163703],
  "Tiago Dutra": [104850,104851],
  "Walter Azevedo": [130106],
  "Well Tennis": [135611],
  "Wellington dos Santos": [135554,160951]
};

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });
  await client.connect();
  
  console.log('--- Fazendo a atualização de Gênero ---');
  const resClients = await client.query('SELECT "id", "name", "gender" FROM "ClientProfile"');
  let mCount = 0;
  let fCount = 0;
  
  for(let c of resClients.rows) {
      if(!c.name) continue;
      let firstName = c.name.split(' ')[0].toLowerCase().trim();
      let gender = null;
      
      // Exceções comuns femininas terminadas em consoante  / etc
      const femaleExceptions = ['carmen', 'miriam', 'ester', 'ruth', 'maris', 'iris', 'tais', 'lais', 'beatriz', 'inês', 'aline', 'viviane', 'raquel', 'ariane', 'cleide', 'leide', 'simone', 'cristiane', 'rose', 'elis', 'shirley', 'daiane'];
      // Exceções comuns masculinas terminadas em A
      const maleExceptions = ['luca', 'lucca', 'juca', 'nicolas', 'lucas', 'andré', 'andre', 'felipe', 'henrique', 'guilherme', 'alexandre', 'thiago', 'tiago', 'diego', 'diogo', 'caio', 'ênio', 'breno', 'bruno', 'arthur', 'miguel', 'gabriel', 'rafael', 'leonel', 'daniel', 'samuel', 'emanuel', 'victor', 'joão', 'joao', 'josé', 'jose', 'tomé', 'tom', 'igor', 'heitor', 'cauã', 'luan', 'kauan', 'jean', 'renan', 'ivan', 'robson', 'edson', 'nelson', 'wanderson', 'gilson', 'emerson', 'ailton', 'welton', 'erick', 'derick', 'alex', 'carlos', 'marcos', 'mateus', 'matheus', 'tomas', 'jonas', 'lias', 'matias', 'messias', 'oséias', 'isaias', 'jeremias', 'osias', 'abdias', 'josias', 'zacarias', 'uri', 'yuri', 'davi', 'levi', 'rui', 'luis', 'luiz', 'dênis'];
      
      if(femaleExceptions.includes(firstName)) {
          gender = 'F';
      } else if(maleExceptions.includes(firstName)) {
          gender = 'M';
      } else {
          // General rule: ends with 'a' is usually female in Brazil, all others usually male.
          if(firstName.endsWith('a') || firstName.endsWith('iely') || firstName.endsWith('ielly')) {
              gender = 'F';
          } else {
              gender = 'M';
          }
      }
      
      if(gender !== c.gender) {
          await client.query('UPDATE "ClientProfile" SET "gender"=$1 WHERE "id"=$2', [gender, c.id]);
          if(gender === 'M') mCount++; else fCount++;
      }
  }
  
  console.log(`✅ Gêneros atualizados: ${mCount} Masculinos e ${fCount} Femininos configurados!`);
  
  console.log('--- Fazendo a atualização de Professores ---');
  // First, fetch the professors to map their names to IDs
  const resProfessors = await client.query('SELECT "id", "name" FROM "User" WHERE "role"=\'PROFESSOR\'');
  const profMap = {};
  for(let p of resProfessors.rows) {
      profMap[p.name.trim().toLowerCase()] = p.id;
  }
  
  let pCount = 0;
  for(let profName in updatesProfessors) {
      let idsToUpdate = updatesProfessors[profName];
      let pId = profMap[profName.trim().toLowerCase()];
      if(!pId) {
          console.warn('⚠️ Professor não encontrado no BD da Vercel: ' + profName + '. Tentando busca parcial...');
          let matched = resProfessors.rows.find(r => r.name.toLowerCase().includes(profName.trim().toLowerCase()) || profName.trim().toLowerCase().includes(r.name.toLowerCase()));
          if(matched) {
              pId = matched.id;
              console.log('  Encontrado parcial: ' + matched.name);
          } else {
              console.log('  Nenhum encontrado. Ignorando alunos do '+profName);
              continue;
          }
      }
      
      for(let numericId of idsToUpdate) {
         await client.query('UPDATE "ClientProfile" SET "professorId"=$1 WHERE "numericId"=$2', [pId, numericId]);
         pCount++;
      }
  }
  
  console.log(`✅ ${pCount} clientes vinculados aos seus respectivos professores!`);
  
  await client.end();
}
run();
