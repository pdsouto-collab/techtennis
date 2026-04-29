const fs = require('fs');
const path = './backend/api/index.js';
let content = fs.readFileSync(path, 'utf8');

// POST /api/customers
content = content.replace(
  /const \{ name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numericId, gender \} = req\.body;/,
  `const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numericId, gender } = req.body;`
);

content = content.replace(
  /INSERT INTO "ClientProfile" \("name", "email", "phone", "originClub", "professorId", "birthDate", "cpfCnpj", "landline", "address", "cep", "city", "country", "stringingPoint", "racketpediaCode", "customerType", "notes", "numericId"\)/,
  `INSERT INTO "ClientProfile" ("name", "email", "phone", "originClub", "professorId", "birthDate", "cpfCnpj", "landline", "address", "cep", "city", "country", "stringingPoint", "racketpediaCode", "customerType", "notes", "numericId", "gender")`
);

content = content.replace(
  /VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11, \$12, \$13, \$14, \$15, \$16, \$17\) RETURNING \*/,
  `VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`
);

content = content.replace(
  /const result = await db\.query\(insertQ, \[name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId\]\);/,
  `const result = await db.query(insertQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId, gender || null]);`
);


// PUT /api/customers/:id
content = content.replace(
  /const \{ name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, prepaid, numericId \} = req\.body;/,
  `const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, prepaid, numericId, gender } = req.body;`
);

content = content.replace(
  /UPDATE "ClientProfile" SET "name"=\$1, "email"=\$2, "phone"=\$3, "originClub"=\$4, "professorId"=\$5, "birthDate"=\$6, "cpfCnpj"=\$7, "landline"=\$8, "address"=\$9, "cep"=\$10, "city"=\$11, "country"=\$12, "stringingPoint"=\$13, "racketpediaCode"=\$14, "customerType"=\$15, "notes"=COALESCE\(\$16, "notes"\), "prepaid"=COALESCE\(\$17, "prepaid"\), "numericId"=\$18/,
  `UPDATE "ClientProfile" SET "name"=$1, "email"=$2, "phone"=$3, "originClub"=$4, "professorId"=$5, "birthDate"=$6, "cpfCnpj"=$7, "landline"=$8, "address"=$9, "cep"=$10, "city"=$11, "country"=$12, "stringingPoint"=$13, "racketpediaCode"=$14, "customerType"=$15, "notes"=COALESCE($16, "notes"), "prepaid"=COALESCE($17, "prepaid"), "numericId"=$18, "gender"=$19`
);

content = content.replace(
  /WHERE "id"=\$19 RETURNING \*/,
  `WHERE "id"=$20 RETURNING *`
);

content = content.replace(
  /const result = await db\.query\(updateQ, \[name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes \? JSON\.stringify\(notes\) : null, prepaid \? JSON\.stringify\(prepaid\) : null, numId, req\.params\.id\]\);/,
  `const result = await db.query(updateQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes ? JSON.stringify(notes) : null, prepaid ? JSON.stringify(prepaid) : null, numId, gender || null, req.params.id]);`
);


fs.writeFileSync(path, content, 'utf8');
console.log('Fixed customers API gender!');
