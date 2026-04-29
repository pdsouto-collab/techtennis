const fs = require('fs');
const path = './api/index.js';

let content = fs.readFileSync(path, 'utf8');

// POST /api/jobs
content = content.replace(
  'hasOwnReel, hasOwnSet, pickupNotes, stringingPoint } = req.body;',
  'hasOwnReel, hasOwnSet, pickupNotes, stringingPoint, hasLogo, logoNotes, racketNotes } = req.body;'
);

content = content.replace(
  '"stringingPoint", "createdAt", "updatedAt")',
  '"stringingPoint", "hasLogo", "logoNotes", "racketNotes", "createdAt", "updatedAt")'
);

content = content.replace(
  'stringingPoint || null\n    ]);',
  'stringingPoint || null, hasLogo ? true : false, logoNotes || null, racketNotes || null\n    ]);'
);

// PUT /api/jobs/:id
content = content.replace(
  'stringerName, feedback, hasOwnReel, hasOwnSet, pickupNotes, stringingPoint } = req.body;',
  'stringerName, feedback, hasOwnReel, hasOwnSet, pickupNotes, stringingPoint, hasLogo, logoNotes, racketNotes } = req.body;'
);

content = content.replace(
  '"hasOwnReel" = $31, "hasOwnSet" = $32, "pickupNotes" = $33, "stringingPoint" = $34, "updatedAt" = NOW()',
  '"hasOwnReel" = $31, "hasOwnSet" = $32, "pickupNotes" = $33, "stringingPoint" = $34, "hasLogo" = $35, "logoNotes" = $36, "racketNotes" = $37, "updatedAt" = NOW()'
);

content = content.replace(
  'hasOwnSet ? true : false, pickupNotes || null, stringingPoint || null\n      ]',
  'hasOwnSet ? true : false, pickupNotes || null, stringingPoint || null, hasLogo ? true : false, logoNotes || null, racketNotes || null\n      ]'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Backend index.js patched with Logo successfully!');
