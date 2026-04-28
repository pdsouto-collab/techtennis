const fs = require('fs');
let file = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

// 1. Fix Professor Selection Dropdown
file = file.replace(/<select name="professor" defaultValue=\{selectedCustomer\?\.professor \|\| ''\}/, '<select name="professorId" defaultValue={selectedCustomer?.professorId || \'\'}');
file = file.replace(/<option key=\{p\.id\} value=\{p\.name\}>\{p\.name\}<\/option>/g, '<option key={p.id} value={p.id}>{p.name}</option>');

// 2. Fix the Table Headers (remove Telefone Fixo)
let oldHeaders = `                    <tr style={{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Nome</th>
  <th style={{ padding: '16px', fontWeight: 600 }}>ID TechTennis</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Ponto de Encordoamento</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Professor</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Clube</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>E-mail</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Telefone Fixo</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Celular</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}></th>
                    </tr>`;
let newHeaders = `                    <tr style={{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Nome</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>ID TechTennis</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Ponto de Encordoamento</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Professor</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Clube</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>E-mail</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Celular</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}></th>
                    </tr>`;
file = file.replace(oldHeaders, newHeaders);

// 3. Fix the Table Rows
let newRows = `                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600 }}>{customer.name}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{customer.numericId || 'Não informado'}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{customer.stringingPoint || 'Nenhum'}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{professors.find((p: any) => p.id === customer.professorId)?.name || 'Não informado'}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{customer.originClub || 'Não informado'}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{customer.email || 'Não informado'}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{customer.phone ? applyPhoneMask(customer.phone) : ''}</td>`;

const regexRows = /<td style=\{\{ padding: '16px', fontSize: '14px', fontWeight: 600 \}\}>\{customer\.name\}<\/td>\s*<td style=\{\{ padding: '16px', fontSize: '14px' \}\}>.*?\s*<td.*?\s*<td.*?\s*<td.*?\s*<td.*?\s*<td.*?<\/td>/;

file = file.replace(regexRows, newRows);

fs.writeFileSync('src/components/StringerDashboard.tsx', file);
console.log('Fixed UI mapping issues!');
