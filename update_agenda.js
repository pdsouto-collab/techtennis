const fs = require('fs');
let c = fs.readFileSync('web/src/components/OpenAgenda.tsx', 'utf8');
if (!c.includes('applyPhoneMask')) {
  c = c.replace(/import \{ Calendar, MapPin, DollarSign, Phone, Activity, Plus, ArrowLeft, Trash2, Edit, User as UserIcon \} from 'lucide-react';/, "import { Calendar, MapPin, DollarSign, Phone, Activity, Plus, ArrowLeft, Trash2, Edit, User as UserIcon } from 'lucide-react';\nimport { applyPhoneMask } from '../utils/masks';");
  c = c.replace(/<span>\{slot\.phone\}<\/span>/g, "<span>{slot.phone ? applyPhoneMask(slot.phone) : ''}</span>");
  c = c.replace(/<input type="tel" value=\{phone\} onChange=\{e => setPhone\(e\.target\.value\)\} required style=\{inputStyle\} placeholder="\(11\) 99999-9999" \/>/g, "<input type=\"tel\" value={phone} onChange={e => setPhone(applyPhoneMask(e.target.value))} required style={inputStyle} placeholder=\"+55 (11) 99999-9999\" />");
  fs.writeFileSync('web/src/components/OpenAgenda.tsx', c);
  console.log('Patched OpenAgenda');
}
