const fs = require('fs');
let c = fs.readFileSync('web/src/utils/masks.ts', 'utf8');

c += `
export const applyCpfCnpjMask = (val: string) => {
  if (!val) return '';
  let v = val.replace(/\\D/g, '');
  if (v.length <= 11) {
    v = v.slice(0,11);
    if (v.length > 9) return \`\${v.slice(0,3)}.\${v.slice(3,6)}.\${v.slice(6,9)}-\${v.slice(9)}\`;
    if (v.length > 6) return \`\${v.slice(0,3)}.\${v.slice(3,6)}.\${v.slice(6)}\`;
    if (v.length > 3) return \`\${v.slice(0,3)}.\${v.slice(3)}\`;
    return v;
  }
  v = v.slice(0,14);
  if (v.length > 12) return \`\${v.slice(0,2)}.\${v.slice(2,5)}.\${v.slice(5,8)}/\${v.slice(8,12)}-\${v.slice(12)}\`;
  if (v.length > 8) return \`\${v.slice(0,2)}.\${v.slice(2,5)}.\${v.slice(5,8)}/\${v.slice(8)}\`;
  if (v.length > 5) return \`\${v.slice(0,2)}.\${v.slice(2,5)}.\${v.slice(5)}\`;
  if (v.length > 2) return \`\${v.slice(0,2)}.\${v.slice(2)}\`;
  return v;
};
`;

fs.writeFileSync('web/src/utils/masks.ts', c);
