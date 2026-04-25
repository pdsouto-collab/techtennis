const fs = require('fs');
let c = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');
c = c.replace(/import \{ SettingsView \} from '\.\/SettingsView';/, "import { SettingsView } from './SettingsView';\nimport { applyPhoneMask } from '../utils/masks';");
c = c.replace(/\{prof\.phone \|\| ''\}/g, "{prof.phone ? applyPhoneMask(prof.phone) : ''}");
c = c.replace(/\{customer\.phone \|\| ''\}/g, "{customer.phone ? applyPhoneMask(customer.phone) : ''}");
c = c.replace(/<input name="phone" type="tel" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba\(0,0,0,0\.1\)', color: 'white', fontSize: '15px' }} required defaultValue={selectedCustomer \? selectedCustomer\.phone : ''} \/>/g, "<input name=\"phone\" type=\"tel\" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white', fontSize: '15px' }} required onChange={(e) => e.target.value = applyPhoneMask(e.target.value)} defaultValue={selectedCustomer && selectedCustomer.phone ? applyPhoneMask(selectedCustomer.phone) : ''} />");
c = c.replace(/<input name="phone" defaultValue={selectedProfessor\?\.phone \|\| ''} style=\{inputStyle\} \/>/g, "<input name=\"phone\" onChange={(e) => e.target.value = applyPhoneMask(e.target.value)} defaultValue={selectedProfessor?.phone ? applyPhoneMask(selectedProfessor.phone) : ''} style={inputStyle} />");
fs.writeFileSync('web/src/components/StringerDashboard.tsx', c);
console.log('Patched StringerDashboard');
