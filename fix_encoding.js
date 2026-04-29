const fs = require('fs');
const content = fs.readFileSync('./web/src/components/StringerDashboard.tsx');
// Remove null bytes and trailing corrupted characters.
// The file is mostly UTF-8. 
// Let's just find the last valid closing brace `};` and cut off the rest.
const str = content.toString('utf8');
const lastValidIndex = str.lastIndexOf('};');
if (lastValidIndex !== -1) {
  const cleanStr = str.substring(0, lastValidIndex + 2) + '\n';
  fs.writeFileSync('./web/src/components/StringerDashboard.tsx', cleanStr, 'utf8');
  console.log('Fixed');
} else {
  console.log('Could not find };');
}
