const fs = require('fs');
const path = './web/src/components/StringerDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = /stringingPoint:\s*jobStringingPoint\s*\};/;
const replacement = `stringingPoint: jobStringingPoint,
      hasOwnReel,
      hasOwnSet,
      hasLogo,
      logoNotes,
      racketNotes
    };`;

content = content.replace(target, replacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed job payload!');
