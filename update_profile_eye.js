const fs = require('fs');
let code = fs.readFileSync('web/src/components/ProfileSettingsModal.tsx', 'utf8');

// 1. imports
code = code.replace(
  "import { User as UserIcon, Phone, Camera, X, Mail, Lock } from 'lucide-react';",
  "import { User as UserIcon, Phone, Camera, X, Mail, Lock, Eye, EyeOff } from 'lucide-react';"
);

// 2. state
code = code.replace(
  "  const [password, setPassword] = useState('');",
  "  const [password, setPassword] = useState('');\n  const [confirmPassword, setConfirmPassword] = useState('');\n  const [showPassword, setShowPassword] = useState(false);\n  const [showConfirmPassword, setShowConfirmPassword] = useState(false);"
);

// 3. handleSave validation
code = code.replace(
  "    setLoading(true);",
  "    if (password && password !== confirmPassword) {\n      alert('As senhas não coincidem!');\n      return;\n    }\n    setLoading(true);"
);

// 4. Update the password field and add confirm password
const oldPasswordField = `          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Nova Senha (opcional)</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type="password" placeholder="Deixe em branco para manter a atual" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
            </div>
          </div>`;

const newPasswordFields = `          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Nova Senha (opcional)</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
              <input type={showPassword ? "text" : "password"} placeholder="Deixe em branco para manter a atual" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '14px 48px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          {password && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Confirmar Nova Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirme a nova senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '14px 48px 14px 48px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}`;

code = code.replace(oldPasswordField, newPasswordFields);

fs.writeFileSync('web/src/components/ProfileSettingsModal.tsx', code);
console.log('ProfileSettingsModal updated eye icon!');
