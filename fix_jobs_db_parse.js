const fs = require('fs');

const file = 'backend/api/index.js';
let c = fs.readFileSync(file, 'utf8');

const parseLogic = `
    const parseNum = (val) => (val === '' || val === null || val === undefined) ? null : parseFloat(val);
    const p_price = parseNum(price);
    const p_preStretchMain = parseNum(preStretchMain);
    const p_preStretchCross = parseNum(preStretchCross);
    const p_basePrice = parseNum(basePrice);
    const p_priceDiscountPercent = parseNum(priceDiscountPercent);
    const p_priceDiscountValue = parseNum(priceDiscountValue);
    const p_tensionMain = parseNum(tensionMain);
    const p_tensionCross = parseNum(tensionCross);
`;

const postReplacer = `
    const result = await db.query(insertQ, [
      cId, customerName || 'Desconhecido', customerName || 'Desconhecido', racketModel || 'N/A', type || 'to_string', tension || '', p_price, mainString || '', crossString || '', orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, p_preStretchMain, p_preStretchCross, p_basePrice, p_priceDiscountPercent, p_priceDiscountValue, p_tensionMain, p_tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null
    ]);
`;

const putReplacer = `
      const result = await db.query(updateQ, [
        cId, customerName || 'Desconhecido', customerName || 'Desconhecido', racketModel || 'N/A', type || 'to_string', tension || '', p_price, status, mainString || '', crossString || '', orderCode, isHybrid, racketId, isStringing, stringingType, tensionUnit, p_preStretchMain, p_preStretchCross, p_basePrice, p_priceDiscountPercent, p_priceDiscountValue, p_tensionMain, p_tensionCross, pickupDate, commissionedProfessorId, auxServices ? JSON.stringify(auxServices) : null, jobId
      ]);
`;

// Replace POST /api/jobs array
c = c.replace(/const result = await db\.query\(insertQ, \[\s*cId, customerName[^\]]*pickupDate, commissionedProfessorId,[^\]]*\]\);/g, postReplacer);

// Inject parse logic into POST
c = c.replace(/const cId = customerId \|\| 'temp_cust_id';/g, "const cId = customerId || 'temp_cust_id';" + parseLogic);

// Replace PUT array
c = c.replace(/const result = await db\.query\(updateQ, \[\s*cId, customerName[^\]]*jobId\s*\]\);/g, putReplacer);

fs.writeFileSync(file, c, 'utf8');
console.log('Fixed jobs!');
