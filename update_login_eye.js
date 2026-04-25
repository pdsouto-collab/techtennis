const fs = require('fs');
let code = fs.readFileSync('web/src/components/LoginView.tsx', 'utf8');

// 1. imports
if (!code.includes('EyeOff')) {
  code = code.replace(
    "import { motion, AnimatePresence } from 'framer-motion';",
    "import { motion, AnimatePresence } from 'framer-motion';\nimport { Eye, EyeOff } from 'lucide-react';"
  );
}

// 2. state
if (!code.includes('showPassword')) {
  code = code.replace(
    "  const [password, setPassword] = useState('');",
    "  const [password, setPassword] = useState('');\n  const [showPassword, setShowPassword] = useState(false);\n  const [showConfirmPassword, setShowConfirmPassword] = useState(false);"
  );
}

// 3. Login password input
const oldLoginPasswordInput = `<input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />`;
const newLoginPasswordInput = `<div style={{ position: 'relative' }}>
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: '48px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>`;
code = code.replace(oldLoginPasswordInput, newLoginPasswordInput);

// 4. Register password input
const oldRegPasswordInput = `<input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />`;
const newRegPasswordInput = `<div style={{ position: 'relative' }}>
                    <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: '48px' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>`;
code = code.replace(oldRegPasswordInput, newRegPasswordInput);

// 5. Register confirm password input
const oldRegConfirmInput = `<input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} />`;
const newRegConfirmInput = `<div style={{ position: 'relative' }}>
                    <input required type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ ...inputStyle, paddingRight: '48px' }} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>`;
code = code.replace(oldRegConfirmInput, newRegConfirmInput);

fs.writeFileSync('web/src/components/LoginView.tsx', code);
console.log('LoginView updated eye icon!');
