const fs = require('fs');
const path = './api/index.js';

let content = fs.readFileSync(path, 'utf8');

// 1. PATCH POST /api/jobs
content = content.replace(
  'const { customerId, customerName, racketModel, type, tension, price, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices, date, stringerName } = req.body;',
  'const { customerId, customerName, racketModel, type, tension, price, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices, date, stringerName, hasOwnReel, hasOwnSet, pickupNotes } = req.body;'
);

content = content.replace(
  '("id", "customerId", "customerNameAlias", "customerName", "racketModel", "type", "tension", "price", "status", "stringMains", "stringCross", "orderCode", "isHybrid", "racketId", "isStringing", "stringingType", "tensionUnit", "preStretchMain", "preStretchCross", "basePrice", "priceDiscountPercent", "priceDiscountValue", "tensionMain", "tensionCross", "pickupDate", "commissionedProfessorId", "auxServices", "date", "stringerName", "createdAt", "updatedAt")',
  '("id", "customerId", "customerNameAlias", "customerName", "racketModel", "type", "tension", "price", "status", "stringMains", "stringCross", "orderCode", "isHybrid", "racketId", "isStringing", "stringingType", "tensionUnit", "preStretchMain", "preStretchCross", "basePrice", "priceDiscountPercent", "priceDiscountValue", "tensionMain", "tensionCross", "pickupDate", "commissionedProfessorId", "auxServices", "date", "stringerName", "hasOwnReel", "hasOwnSet", "pickupNotes", "createdAt", "updatedAt")'
);

content = content.replace(
  "(gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'aguardando', $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, NOW(), NOW())",
  "(gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'aguardando', $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, NOW(), NOW())"
);

content = content.replace(
  'cId, customerName || \'Desconhecido\', customerName || \'Desconhecido\', racketModel || \'N/A\', type || \'to_string\', tension || \'\', p_price, mainString || \'\', crossString || \'\', orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, p_preStretchMain, p_preStretchCross, p_basePrice, p_priceDiscountPercent, p_priceDiscountValue, p_tensionMain, p_tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, date, stringerName',
  'cId, customerName || \'Desconhecido\', customerName || \'Desconhecido\', racketModel || \'N/A\', type || \'to_string\', tension || \'\', p_price, mainString || \'\', crossString || \'\', orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, p_preStretchMain, p_preStretchCross, p_basePrice, p_priceDiscountPercent, p_priceDiscountValue, p_tensionMain, p_tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, date, stringerName, hasOwnReel ? true : false, hasOwnSet ? true : false, pickupNotes || null'
);

// 2. PATCH PUT /api/jobs/:id
content = content.replace(
  'const { customerId, customerName, racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices, date, stringerName, feedback } = req.body;',
  'const { customerId, customerName, racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices, date, stringerName, feedback, hasOwnReel, hasOwnSet, pickupNotes } = req.body;'
);

content = content.replace(
  '"stringerName" = $28, "feedback" = COALESCE($29, "feedback"), "updatedAt" = NOW()',
  '"stringerName" = $28, "feedback" = COALESCE($29, "feedback"), "hasOwnReel" = $31, "hasOwnSet" = $32, "pickupNotes" = $33, "updatedAt" = NOW()'
);

content = content.replace(
  'cId, customerName || \'Desconhecido\', customerName || \'Desconhecido\', racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, date, stringerName, feedback ? JSON.stringify(feedback) : null, req.params.id',
  'cId, customerName || \'Desconhecido\', customerName || \'Desconhecido\', racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, date, stringerName, feedback ? JSON.stringify(feedback) : null, req.params.id, hasOwnReel ? true : false, hasOwnSet ? true : false, pickupNotes || null'
);

// 3. PATCH PUT /api/customers/:id
content = content.replace(
  'const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numericId } = req.body;',
  'const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, prepaid, numericId } = req.body;'
);

content = content.replace(
  'UPDATE "ClientProfile" SET "name"=$1, "email"=$2, "phone"=$3, "originClub"=$4, "professorId"=$5, "birthDate"=$6, "cpfCnpj"=$7, "landline"=$8, "address"=$9, "cep"=$10, "city"=$11, "country"=$12, "stringingPoint"=$13, "racketpediaCode"=$14, "customerType"=$15, "notes"=$16, "numericId"=$17\n      WHERE "id"=$18 RETURNING *',
  'UPDATE "ClientProfile" SET "name"=$1, "email"=$2, "phone"=$3, "originClub"=$4, "professorId"=$5, "birthDate"=$6, "cpfCnpj"=$7, "landline"=$8, "address"=$9, "cep"=$10, "city"=$11, "country"=$12, "stringingPoint"=$13, "racketpediaCode"=$14, "customerType"=$15, "notes"=COALESCE($16, "notes"), "prepaid"=COALESCE($17, "prepaid"), "numericId"=$18\n      WHERE "id"=$19 RETURNING *'
);

content = content.replace(
  'const result = await db.query(updateQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, numId, req.params.id]);',
  'const result = await db.query(updateQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes ? JSON.stringify(notes) : null, prepaid ? JSON.stringify(prepaid) : null, numId, req.params.id]);'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Backend index.js patched successfully!');
