const fs = require('fs');
const path = './web/src/components/StringerDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<AnalyticsView jobs=\{filteredJobs\} appSettings=\{appSettings\} customers=\{customers\} professors=\{professors\} \/>/,
  `<AnalyticsView jobs={filteredJobs} appSettings={appSettings} customers={customers} professors={professors} rackets={rackets} />`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched StringerDashboard.tsx');
