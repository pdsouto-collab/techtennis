const {Client} = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect().then(() => 
  client.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name IN ('Job', 'Customer')")
).then(res => {
  console.log(JSON.stringify(res.rows, null, 2));
  client.end();
}).catch(console.error);
