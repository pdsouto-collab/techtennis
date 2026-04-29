const fs = require('fs');
const path = './web/src/components/AnalyticsView.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update props
content = content.replace(
  /const AnalyticsView = \(\{ jobs, customers, appSettings, professors \}: any\) => \{/,
  `const AnalyticsView = ({ jobs, customers, appSettings, professors, rackets }: any) => {`
);

// 2. Fix stringTypes logic (replace j.mainString with (j.stringMains || j.mainString))
// Wait, there are multiple j.mainString in AnalyticsView.tsx! Let's do a global replace carefully.
// I will replace `j.mainString` with `(j.stringMains || j.mainString)` but only in AnalyticsView.tsx.
content = content.replace(/j\.mainString/g, '(j.stringMains || j.mainString)');

// 3. Fix crossString
content = content.replace(/j\.crossString/g, '(j.stringCross || j.crossString)');

// 4. Fix Rackets local storage fallback
content = content.replace(
  /const savedRackets = localStorage\.getItem\('tt_rackets'\);\s*const rackets = savedRackets \? JSON\.parse\(savedRackets\) : \[\];/g,
  `// rackets passed via props`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched AnalyticsView.tsx');
