const fs = require('fs');
let file = fs.readFileSync('api/index.js', 'utf8');

const regexPostBody = /const \{ name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId \} = req\.body;/;
const replacePostBody = 'const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId, gender } = req.body;';

file = file.replace(regexPostBody, replacePostBody);

const regexPostQuery = /const insertQ = `\n\s*INSERT INTO "ClientProfile" \("name", "email", "phone", "originClub", "professorId", "birthDate", "cpfCnpj", "landline", "address", "cep", "city", "country", "stringingPoint", "racketpediaCode", "customerType", "notes", "numericId"\)\n\s*VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11, \$12, \$13, \$14, \$15, \$16, \$17\) RETURNING \*\n\s*`;\n\s*const result = await db.query\(insertQ, \[name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId\]\);/;

const newPostQuery = `const insertQ = \`
      INSERT INTO "ClientProfile" ("name", "email", "phone", "originClub", "professorId", "birthDate", "cpfCnpj", "landline", "address", "cep", "city", "country", "stringingPoint", "racketpediaCode", "customerType", "notes", "numericId", "gender")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *
    \`;
    const result = await db.query(insertQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId, gender]);`;

file = file.replace(regexPostQuery, newPostQuery);

const regexPutBody = /const \{ name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numericId \} = req\.body;/;
const replacePutBody = 'const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numericId, gender } = req.body;';

file = file.replace(regexPutBody, replacePutBody);

const regexPutQuery = /const updateQ = `\n\s*UPDATE "ClientProfile" SET "name"=\$1, "email"=\$2, "phone"=\$3, "originClub"=\$4, "professorId"=\$5, "birthDate"=\$6, "cpfCnpj"=\$7, "landline"=\$8, "address"=\$9, "cep"=\$10, "city"=\$11, "country"=\$12, "stringingPoint"=\$13, "racketpediaCode"=\$14, "customerType"=\$15, "notes"=\$16, "numericId"=\$17\n\s*WHERE "id"=\$18 RETURNING \*\n\s*`;\n\s*const result = await db.query\(updateQ, \[name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId, req\.params\.id\]\);/;

const newPutQuery = `const updateQ = \`
      UPDATE "ClientProfile" SET "name"=$1, "email"=$2, "phone"=$3, "originClub"=$4, "professorId"=$5, "birthDate"=$6, "cpfCnpj"=$7, "landline"=$8, "address"=$9, "cep"=$10, "city"=$11, "country"=$12, "stringingPoint"=$13, "racketpediaCode"=$14, "customerType"=$15, "notes"=$16, "numericId"=$17, "gender"=$18
      WHERE "id"=$19 RETURNING *
    \`;
    const result = await db.query(updateQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId, gender, req.params.id]);`;

file = file.replace(regexPutQuery, newPutQuery);

fs.writeFileSync('api/index.js', file);
console.log('Fixed API Gender logic!');
