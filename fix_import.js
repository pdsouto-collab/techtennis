const fs = require('fs');
let c = fs.readFileSync('web/src/components/ClassManagementProfessor.tsx', 'utf8');
if (!c.includes('import { applyPhoneMask }')) {
  c = c.replace(/import React/, "import { applyPhoneMask } from '../utils/masks';\nimport React");
  fs.writeFileSync('web/src/components/ClassManagementProfessor.tsx', c);
  console.log('Fixed import');
}
