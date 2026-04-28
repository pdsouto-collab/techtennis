const fs = require('fs');

let file = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

const regexCustFormStart = /<form style=\{\{ display: 'flex', flexDirection: 'column', gap: '20px' \}\} onSubmit=\{async \(e\) => \{ \n\s*e\.preventDefault\(\); \n\s*const fd = new FormData\(e\.currentTarget\);/g;

file = file.replace(regexCustFormStart, `<form key={selectedCustomer?.id || 'new'} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={async (e) => { 
                    e.preventDefault(); 
                    const fd = new FormData(e.currentTarget);`);

const regexCustData = /const customerData = \{\n\s*name: `\$\{firstName\} \$\{lastName\}`\.trim\(\),\n\s*phone: fd\.get\('phone'\) as string,\n\s*email: fd\.get\('email'\) as string,\n\s*originClub: fd\.get\('originClub'\) as string,\n\s*professorId: fd\.get\('professorId'\) as string,\n\s*birthDate: fd\.get\('birthDate'\) as string,\n\s*cpfCnpj: fd\.get\('cpfCnpj'\) as string,\n\s*landline: fd\.get\('landline'\) as string,\n\s*address: fd\.get\('address'\) as string,\n\s*cep: fd\.get\('cep'\) as string,\n\s*city: fd\.get\('city'\) as string,\n\s*country: fd\.get\('country'\) as string,\n\s*stringingPoint: fd\.get\('stringingPoint'\) as string,\n\s*racketpediaCode: fd\.get\('racketpediaCode'\) as string,\n\s*customerType: fd\.get\('customerType'\) as string,\n\s*notes: fd\.get\('notes'\) as string\n\s*\};/;

const newCustData = `const customerData = {
                      name: \`\${firstName} \${lastName}\`.trim(),
                      phone: fd.get('phone') as string,
                      email: fd.get('email') as string,
                      originClub: fd.get('originClub') as string,
                      professorId: fd.get('professorId') as string,
                      birthDate: fd.get('birthDate') as string,
                      cpfCnpj: fd.get('cpfCnpj') as string,
                      landline: fd.get('landline') as string,
                      address: fd.get('address') as string,
                      cep: fd.get('cep') as string,
                      city: fd.get('city') as string,
                      country: fd.get('country') as string,
                      stringingPoint: fd.get('stringingPoint') as string,
                      racketpediaCode: fd.get('racketpediaCode') as string,
                      customerType: fd.get('customerType') as string,
                      notes: fd.get('notes') as string,
                      numericId: fd.get('numericId') ? parseInt(fd.get('numericId') as string, 10) : undefined
                    };`;

file = file.replace(regexCustData, newCustData);

const oldCustInput = `<input type="text" disabled style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: '15px', fontWeight: 600 }} value={selectedCustomer?.numericId ? String(selectedCustomer.numericId).padStart(6, '0') : 'Gerado automaticamente ao salvar'} />`;
const newCustInput = `<input name="numericId" type="number" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }} defaultValue={selectedCustomer?.numericId || ''} placeholder="Ex: 104151 (ou deixe em branco para gerar novo)" />`;

file = file.replace(oldCustInput, newCustInput);

fs.writeFileSync('src/components/StringerDashboard.tsx', file);
console.log('Customer UI fully updated');
