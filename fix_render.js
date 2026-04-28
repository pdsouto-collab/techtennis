const fs = require('fs');
let text = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');

const target = `{selectedProfessor?.id && (
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px' }}>ID TechTennis</label>
                          <input readOnly value={selectedProfessor?.numericId || 'Gerado internamente'} style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }} />
                        </div>
                      )}`;

const replacement = `<div>
                          <label style={{ display: 'block', marginBottom: '8px' }}>ID TechTennis</label>
                          <input readOnly value={selectedProfessor?.numericId || 'Gerado internamente'} style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }} />
                        </div>`;

if(text.includes(target)) {
    text = text.replace(target, replacement);
    fs.writeFileSync('web/src/components/StringerDashboard.tsx', text);
    console.log('Replaced successfully');
} else {
    console.log('Target not found!!');
}
