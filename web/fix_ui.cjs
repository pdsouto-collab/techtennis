const fs = require('fs');

// 1. Fix StringerDashboard.tsx
let dashboard = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

const oldNewProf = `const newProf = {
                        name: fd.get('name') as string,
                        email: fd.get('email') as string,
                        phone: fd.get('phone') as string,
                        yearsOfExperience: fd.get('yearsOfExperience') as string,
                        trainingTypes: fd.get('trainingTypes') as string
                      };`;

const newNewProf = `const newProf = {
                        name: fd.get('name') as string,
                        email: fd.get('email') as string,
                        phone: fd.get('phone') as string,
                        yearsOfExperience: fd.get('yearsOfExperience') as string,
                        trainingTypes: fd.get('trainingTypes') as string,
                        numericId: fd.get('numericId') ? parseInt(fd.get('numericId') as string, 10) : undefined
                      };`;

dashboard = dashboard.replace(oldNewProf, newNewProf);

const oldInputDiv = `<div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>ID TechTennis (AutomAtico)</label>
                        <input readOnly value={selectedProfessor ? (selectedProfessor.numericId || 'Gerado internamente') : 'SerA gerado apA3s salvar'} style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }} />
                      </div>`;

const newInputDiv = `<div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>ID TechTennis (Automático)</label>
                        <input name="numericId" type="number" defaultValue={selectedProfessor?.numericId || ''} placeholder="Ex: 104151 (ou deixe em branco para gerar novo)" style={inputStyle} />
                      </div>`;
// using regex because to deal with the mangled "AutomAtico" string from encoding!
dashboard = dashboard.replace(/<div>\s*<label[^>]*>ID TechTennis[\s\S]*?<\/div>/, newInputDiv);

fs.writeFileSync('src/components/StringerDashboard.tsx', dashboard);

// 2. Fix OrdersView.tsx
let orders = fs.readFileSync('src/components/OrdersView.tsx', 'utf8');
orders = orders.replace('ID do Cliente', 'ID TechTennis');
fs.writeFileSync('src/components/OrdersView.tsx', orders);

console.log('Fixed UI files.');
