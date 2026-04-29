const fs = require('fs');
const path = './backend/api/index.js';
let content = fs.readFileSync(path, 'utf8');

const putArrayTarget = /hasOwnSet \? true : false, pickupNotes \|\| null, stringingPoint \|\| null\s*\]\);/;
const putArrayReplacement = `hasOwnSet ? true : false, pickupNotes || null, stringingPoint || null, hasLogo ? true : false, logoNotes || null, racketNotes || null
    ]);`;

content = content.replace(putArrayTarget, putArrayReplacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed PUT array in backend!');
