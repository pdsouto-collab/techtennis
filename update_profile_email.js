const fs = require('fs');
let code = fs.readFileSync('web/src/components/ProfileSettingsModal.tsx', 'utf8');

// 1. imports
code = code.replace(
  "import { User as UserIcon, Phone, Camera, X } from 'lucide-react';",
  "import { User as UserIcon, Phone, Camera, X, Mail, Lock } from 'lucide-react';"
);

// 2. state
code = code.replace(
  "  const [phone, setPhone] = useState(currentUser.phone || '');",
  "  const [phone, setPhone] = useState(currentUser.phone || '');\n  const [email, setEmail] = useState(currentUser.email || '');\n  const [password, setPassword] = useState('');"
);

// 3. handleSave payload
code = code.replace(
  "const success = await onUpdate({ name, phone, photoUrl });",
  "const success = await onUpdate({ name, phone, photoUrl, email, password });"
);

// 4. form UI
const oldNamePhoneUi = `          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Nome Completo</label>
            <div style={{ position: 'relative' }}>
              <UserIcon style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Celular</label>
            <div style={{ position: 'relative' }}>
              <Phone style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
            </div>
          </div>`;

const newFormUi = `          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Nome Completo</label>
            <div style={{ position: 'relative' }}>
              <UserIcon style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Celular</label>
            <div style={{ position: 'relative' }}>
              <Phone style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Nova Senha (opcional)</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type="password" placeholder="Deixe em branco para manter a atual" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
            </div>
          </div>`;

code = code.replace(oldNamePhoneUi, newFormUi);

fs.writeFileSync('web/src/components/ProfileSettingsModal.tsx', code);
console.log('ProfileSettingsModal updated!');
