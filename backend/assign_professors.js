require('dotenv').config();
const { Client } = require('pg');

const db = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

const mapData = {
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

db.connect()
  .then(async () => {
    // get ALL users this time
    const res = await db.query('SELECT id, name FROM "User"'); 
    const users = res.rows;
    
    const profIds = {};
    for (const key of Object.keys(mapData)) {
       // exact match first, then partial
       let user = users.find(u => u.name.trim().toLowerCase() === key.trim().toLowerCase());
       if (!user) {
         user = users.find(u => u.name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(u.name.toLowerCase()));
       }
       if (user) {
         profIds[key] = user.id;
       } else {
         console.warn("Could not find matching prof for: " + key);
       }
    }

    const updates = [];
    
    for (const [profName, customerIds] of Object.entries(mapData)) {
       const profId = profIds[profName];
       if (!profId) continue;
       for (const numId of customerIds) {
          updates.push(db.query('UPDATE "ClientProfile" SET "professorId" = $1 WHERE "numericId" = $2', [profId, numId]));
       }
    }

    await Promise.all(updates);
    console.log(`Assigned professor to ${updates.length} clients successfully.`);

  })
  .catch(console.error)
  .finally(() => db.end());
