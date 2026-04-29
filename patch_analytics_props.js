const fs = require('fs');
const path = './web/src/components/AnalyticsView.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update props
content = content.replace(
  /export const AnalyticsView = \(\{ jobs: rawJobs, appSettings, customers = \[\], professors = \[\] \}: any\) => \{/,
  `export const AnalyticsView = ({ jobs: rawJobs, appSettings, customers = [], professors = [], rackets = [] }: any) => {`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed props in AnalyticsView.tsx');
