const fs = require('fs');
let c = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');

c = c.replace(/<th style=\{\{ padding: '16px', fontWeight: 600 \}\}>Name<\/th>/g, "<th style={{ padding: '16px', fontWeight: 600 }}>Nome</th>");
c = c.replace(/<th style=\{\{ padding: '16px', fontWeight: 600 \}\}>Stringing point<\/th>/g, "<th style={{ padding: '16px', fontWeight: 600 }}>Ponto de Encordoamento</th>");
c = c.replace(/<th style=\{\{ padding: '16px', fontWeight: 600 \}\}>Coach<\/th>/g, "<th style={{ padding: '16px', fontWeight: 600 }}>Professor</th>");
c = c.replace(/<th style=\{\{ padding: '16px', fontWeight: 600 \}\}>Club<\/th>/g, "<th style={{ padding: '16px', fontWeight: 600 }}>Clube</th>");
c = c.replace(/<th style=\{\{ padding: '16px', fontWeight: 600 \}\}>Email<\/th>/g, "<th style={{ padding: '16px', fontWeight: 600 }}>E-mail</th>");
c = c.replace(/<th style=\{\{ padding: '16px', fontWeight: 600 \}\}>Phone<\/th>/g, "<th style={{ padding: '16px', fontWeight: 600 }}>Telefone Fixo</th>");
c = c.replace(/<th style=\{\{ padding: '16px', fontWeight: 600 \}\}>Mobile<\/th>/g, "<th style={{ padding: '16px', fontWeight: 600 }}>Celular</th>");

c = c.replace(
  /<td style=\{\{ padding: '16px', fontSize: '14px' \}\}>Test<\/td>\s*<td style=\{\{ padding: '16px', fontSize: '14px' \}\}><\/td>/g,
  `<td style={{ padding: '16px', fontSize: '14px' }}>{customer.stringingPoint || 'Não informado'}</td>
                        <td style={{ padding: '16px', fontSize: '14px' }}>{professors.find((p: any) => p.id === customer.professorId)?.name || 'Nenhum'}</td>`
);

c = c.replace(
  /<td style=\{\{ padding: '16px', fontSize: '14px' \}\}>\{customer\.email \|\| ''\}<\/td>\s*<td style=\{\{ padding: '16px', fontSize: '14px' \}\}><\/td>/g,
  `<td style={{ padding: '16px', fontSize: '14px' }}>{customer.email || 'Não informado'}</td>
                        <td style={{ padding: '16px', fontSize: '14px' }}>{customer.landline ? applyPhoneMask(customer.landline) : ''}</td>`
);


fs.writeFileSync('web/src/components/StringerDashboard.tsx', c);
