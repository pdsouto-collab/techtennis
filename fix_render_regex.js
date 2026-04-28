const fs = require('fs');
let text = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');

// Replace the conditional block with an unconditional div, no matter the exact spacing inside the {...}
text = text.replace(/\{selectedProfessor\?\.id && \([\s\S]*?\}\)/g, 
`<div>
    <label style={{ display: 'block', marginBottom: '8px', color: '#10B981', fontWeight: 600 }}>[ESTÁ AQUI!] ID TechTennis</label>
    <input readOnly value={selectedProfessor?.numericId || 'Será gerado após salvar'} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#9CA3AF', marginBottom: '16px' }} />
</div>`
);

fs.writeFileSync('web/src/components/StringerDashboard.tsx', text);
console.log('Replaced unconditionally.');
