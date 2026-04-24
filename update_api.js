const fs = require('fs');
let code = fs.readFileSync('backend/api/index.js', 'utf8');

// POST replace
code = code.replace(
  'const { professorName, timeAndDay, region, price, type, trainingTypes, phone } = req.body;',
  'const { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary } = req.body;'
);
code = code.replace(
  '"professorName", "timeAndDay", "region", "price", "type", "trainingTypes", "phone"',
  '"professorName", "timeAndDay", "region", "price", "type", "trainingTypes", "phone", "resumeSummary"'
);
code = code.replace(
  'VALUES ($1, $2, $3, $4, $5, $6, $7)',
  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
);
code = code.replace(
  'professorName, timeAndDay, region, price || \'\', type || \'fixo\', trainingTypes, phone',
  'professorName, timeAndDay, region, price || \'\', type || \'fixo\', trainingTypes, phone, resumeSummary || \'\''
);

// PUT replace (alguns ja foram substituídos pelo replace anterior dependendo se foi global, mas os replaces acima só dao match no primeiro. Vamos forçar o segundo manual)
code = code.replace(
  'const { professorName, timeAndDay, region, price, type, trainingTypes, phone } = req.body;', // o 2o
  'const { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary } = req.body;'
);
code = code.replace(
  '"phone"=$7',
  '"phone"=$7, "resumeSummary"=$8'
);
code = code.replace(
  'id=$8',
  'id=$9'
);
code = code.replace(
  'professorName, timeAndDay, region, price || \'\', type || \'fixo\', trainingTypes, phone, slotId',
  'professorName, timeAndDay, region, price || \'\', type || \'fixo\', trainingTypes, phone, resumeSummary || \'\', slotId'
);

fs.writeFileSync('backend/api/index.js', code);
console.log('API index.js updated.');
