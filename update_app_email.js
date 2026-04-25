const fs = require('fs');
let code = fs.readFileSync('web/src/App.tsx', 'utf8');

const oldMenu = `                  <button 
                    onClick={() => { alert('Troca de senha enviada para seu e-mail.'); setIsProfileOpen(false); }}
                    style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: '1px solid #eee', fontWeight: 600, color: '#1a1a2e' }}
                    onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Trocar Senha
                  </button>`;

code = code.replace(oldMenu, '');

fs.writeFileSync('web/src/App.tsx', code);
console.log('App.tsx password button removed.');
