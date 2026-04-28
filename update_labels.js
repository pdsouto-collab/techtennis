const fs = require('fs');

let ov = fs.readFileSync('web/src/components/OrdersView.tsx', 'utf8');
ov = ov.replace('ID do Cliente', 'ID TechTennis');
fs.writeFileSync('web/src/components/OrdersView.tsx', ov);

let um = fs.readFileSync('web/src/components/UserManagement.tsx', 'utf8');
um = um.replace('Integração Universal (Numeric ID)', 'ID TechTennis');
um = um.replace('Vínculo Universal (Numeric ID)', 'Vínculo (ID TechTennis)');
um = um.replace('Numeric ID: {selectedUser?.numericId || \'Nenhum\'}', 'ID TechTennis: {selectedUser?.numericId || \'Nenhum\'}');
fs.writeFileSync('web/src/components/UserManagement.tsx', um);

let sd = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');
sd = sd.replace('ID Universal', 'ID TechTennis');

const profModalLabel = `<label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px' }}>Nome Completo *</label>`;
const profModalIdField = `
<div>
<label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px' }}>ID TechTennis</label>
<input type="text" value={selectedProfessor?.numericId || 'Será gerado após salvar'} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#9CA3AF', marginBottom: '16px', fontWeight: 600, fontSize: '14px' }} />
</div>
`;

if(sd.includes(profModalLabel)) {
  sd = sd.replace(profModalLabel, profModalIdField + '\n' + profModalLabel);
}

fs.writeFileSync('web/src/components/StringerDashboard.tsx', sd);
console.log('Update complete.');
