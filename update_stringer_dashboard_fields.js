const fs = require('fs');
let c = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');

// 1. Fix the import
c = c.replace(/import \{ applyPhoneMask \} from '\.\.\/utils\/masks';/, "import { applyPhoneMask, applyCpfCnpjMask } from '../utils/masks';");

// 2. Fix the customerData object mapped fields in the submit handler
c = c.replace(
  /const customerData = \{\n([\s\S]*?)notes: fd\.get\('notes'\) as string\n\s*\};/,
  `const customerData = {
                      name: \`\${fd.get('firstName')} \${fd.get('lastName')}\`,
                      email: fd.get('email') as string,
                      phone: fd.get('phone') as string,
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
                      notes: fd.get('notes') as string
                    };`
);

// 3. Fix the "Ponto de Encordoamento" select to use appSettings mapping
c = c.replace(
  /<select name="stringingPoint" defaultValue=\{selectedCustomer\?\.stringingPoint \|\| 'Test'\} style=\{inputStyle\}>\s*<option value="Test">Test<\/option>\s*<option value="Loja 1">Loja 1<\/option>\s*<\/select>/,
  `<select name="stringingPoint" defaultValue={selectedCustomer?.stringingPoint || ''} style={inputStyle}>
                          <option value="">Selecione...</option>
                          {appSettings?.pickupPoints?.map((p: string) => <option key={p} value={p}>{p}</option>)}
                        </select>`
);

// 4. Attach onChange mask for cpfCnpj
c = c.replace(
  /<input name="cpfCnpj" type="text" defaultValue=\{selectedCustomer\?\.cpfCnpj \|\| ''\} style=\{inputStyle\} \/>/,
  `<input name="cpfCnpj" type="text" onChange={(e) => e.target.value = applyCpfCnpjMask(e.target.value)} defaultValue={selectedCustomer?.cpfCnpj ? applyCpfCnpjMask(selectedCustomer.cpfCnpj) : ''} style={inputStyle} />`
);

fs.writeFileSync('web/src/components/StringerDashboard.tsx', c);
