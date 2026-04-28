const fs = require('fs');
let file = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

// The issue is spacing maybe? Let's just string match exactly what's there
let toReplace = `                      professor: fd.get('professor') as string,`;
let replaceWith = `                      professorId: fd.get('professorId') as string,`;

if (file.includes(toReplace)) {
  file = file.replace(toReplace, replaceWith);
  console.log('Replaced professor extraction!');
} else {
  console.log('Did not find professor extraction! Checking trimmed...');
  file = file.replace(/professor:\s*fd\.get\('professor'\)\s*as\s*string,/, replaceWith);
}

// Ensure the select name is professorId
file = file.replace(/<select name="professor" defaultValue=\{selectedCustomer\?\.professor \|\| ''\}/, '<select name="professorId" defaultValue={selectedCustomer?.professorId || \'\'}');
// Also replace customer?.professor with professorId in the defaultValue if it wasn't caught
file = file.replace(/defaultValue=\{selectedCustomer\?\.professor \|\| ''\}/g, 'defaultValue={selectedCustomer?.professorId || \'\'}');


// For the "Telefone Fixo" header issue in Customers table
const regexCustHeaders = /<tr style=\{\{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' \}\}>\s*<th.*?>Nome<\/th>\s*<th.*?>ID TechTennis<\/th>\s*<th.*?>Ponto de Encordoamento<\/th>\s*<th.*?>Professor<\/th>\s*<th.*?>Clube<\/th>\s*<th.*?>E-mail<\/th>\s*<th.*?>Telefone Fixo<\/th>\s*<th.*?>Celular<\/th>\s*<th.*?><\/th>\s*<\/tr>/;

const newCustHeaders = `<tr style={{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Nome</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>ID TechTennis</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Ponto de Encordoamento</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Professor</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Clube</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>E-mail</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Celular</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}></th>
                    </tr>`;

if (file.match(regexCustHeaders)) {
  console.log('Found old customers headers! Replacing...');
  file = file.replace(regexCustHeaders, newCustHeaders);
} else {
  console.log('Did not find old customers headers');
}

// For the Telefone Fixo in PROFESSORS table, she wants it to be Celular too!
const regexProfHeaders = /<tr style=\{\{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' \}\}>\s*<th.*?>Nome<\/th>\s*<th.*?>E-mail<\/th>\s*<th.*?>Telefone Fixo<\/th>\s*<th.*?><\/th>\s*<\/tr>/;
const newProfHeaders = `<tr style={{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Nome</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>E-mail</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Celular</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}></th>
                    </tr>`;

if (file.match(regexProfHeaders)) {
  console.log('Found old professors headers! Replacing...');
  file = file.replace(regexProfHeaders, newProfHeaders);
}

fs.writeFileSync('src/components/StringerDashboard.tsx', file);
