const fs = require('fs');

const file = 'web/src/components/StringerDashboard.tsx';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('const getRacketDisplayName =')) {
  c = c.replace(
    /export const StringerDashboard = \(\) => \{/,
    `export const StringerDashboard = () => {\n  const getRacketDisplayName = (r: any) => r ? (r.name + (r.identifier ? ' [' + r.identifier + ']' : '')) : '';`
  );
  fs.writeFileSync(file, c);
  console.log('Injected getRacketDisplayName successfully');
} else {
  console.log('Already injected');
}
