const fs = require('fs');
const path = './api/index.js';

let content = fs.readFileSync(path, 'utf8');

// 1. PATCH POST /api/jobs
content = content.replace(
  'const { customerId, customerName, racketModel, type, tension, price, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices, date, stringerName, hasOwnReel, hasOwnSet, pickupNotes } = req.body;',
  'const { customerId, customerName, racketModel, type, tension, price, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices, date, stringerName, hasOwnReel, hasOwnSet, pickupNotes, stringingPoint } = req.body;'
);

content = content.replace(
  '("id", "customerId", "customerNameAlias", "customerName", "racketModel", "type", "tension", "price", "status", "stringMains", "stringCross", "orderCode", "isHybrid", "racketId", "isStringing", "stringingType", "tensionUnit", "preStretchMain", "preStretchCross", "basePrice", "priceDiscountPercent", "priceDiscountValue", "tensionMain", "tensionCross", "pickupDate", "commissionedProfessorId", "auxServices", "date", "stringerName", "hasOwnReel", "hasOwnSet", "pickupNotes", "createdAt", "updatedAt")',
  '("id", "customerId", "customerNameAlias", "customerName", "racketModel", "type", "tension", "price", "status", "stringMains", "stringCross", "orderCode", "isHybrid", "racketId", "isStringing", "stringingType", "tensionUnit", "preStretchMain", "preStretchCross", "basePrice", "priceDiscountPercent", "priceDiscountValue", "tensionMain", "tensionCross", "pickupDate", "commissionedProfessorId", "auxServices", "date", "stringerName", "hasOwnReel", "hasOwnSet", "pickupNotes", "stringingPoint", "createdAt", "updatedAt")'
);

content = content.replace(
  "(gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'aguardando', $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, NOW(), NOW())",
  "(gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'aguardando', $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, NOW(), NOW())"
);

content = content.replace(
  'cId, customerName || \'Desconhecido\', customerName || \'Desconhecido\', racketModel || \'N/A\', type || \'to_string\', tension || \'\', p_price, mainString || \'\', crossString || \'\', orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, p_preStretchMain, p_preStretchCross, p_basePrice, p_priceDiscountPercent, p_priceDiscountValue, p_tensionMain, p_tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, date, stringerName, hasOwnReel ? true : false, hasOwnSet ? true : false, pickupNotes || null',
  'cId, customerName || \'Desconhecido\', customerName || \'Desconhecido\', racketModel || \'N/A\', type || \'to_string\', tension || \'\', p_price, mainString || \'\', crossString || \'\', orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, p_preStretchMain, p_preStretchCross, p_basePrice, p_priceDiscountPercent, p_priceDiscountValue, p_tensionMain, p_tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, date, stringerName, hasOwnReel ? true : false, hasOwnSet ? true : false, pickupNotes || null, stringingPoint || null'
);

// 2. PATCH PUT /api/jobs/:id
content = content.replace(
  'const { customerId, customerName, racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices, date, stringerName, feedback, hasOwnReel, hasOwnSet, pickupNotes } = req.body;',
  'const { customerId, customerName, racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices, date, stringerName, feedback, hasOwnReel, hasOwnSet, pickupNotes, stringingPoint } = req.body;'
);

content = content.replace(
  '"stringerName" = $28, "feedback" = COALESCE($29, "feedback"), "hasOwnReel" = $31, "hasOwnSet" = $32, "pickupNotes" = $33, "updatedAt" = NOW()',
  '"stringerName" = $28, "feedback" = COALESCE($29, "feedback"), "hasOwnReel" = $31, "hasOwnSet" = $32, "pickupNotes" = $33, "stringingPoint" = $34, "updatedAt" = NOW()'
);

content = content.replace(
  'cId, customerName || \'Desconhecido\', customerName || \'Desconhecido\', racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, date, stringerName, feedback ? JSON.stringify(feedback) : null, req.params.id, hasOwnReel ? true : false, hasOwnSet ? true : false, pickupNotes || null',
  'cId, customerName || \'Desconhecido\', customerName || \'Desconhecido\', racketModel, type, tension, price, status, mainString, crossString, orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, preStretchMain, preStretchCross, basePrice, priceDiscountPercent, priceDiscountValue, tensionMain, tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, date, stringerName, feedback ? JSON.stringify(feedback) : null, req.params.id, hasOwnReel ? true : false, hasOwnSet ? true : false, pickupNotes || null, stringingPoint || null'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Backend index.js patched with stringingPoint successfully!');
