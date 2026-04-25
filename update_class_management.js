const fs = require('fs');
let c = fs.readFileSync('web/src/components/ClassManagementProfessor.tsx', 'utf8');
if (!c.includes('applyPhoneMask')) {
  c = c.replace(/import \{ Calendar, MapPin, DollarSign, Users, Clock, Settings, Bell, ChevronLeft, ChevronRight, CheckCircle, Search, Edit2, Trash2, Phone, Mail, User as UserIcon, Plus \} from 'lucide-react';/, "import { Calendar, MapPin, DollarSign, Users, Clock, Settings, Bell, ChevronLeft, ChevronRight, CheckCircle, Search, Edit2, Trash2, Phone, Mail, User as UserIcon, Plus } from 'lucide-react';\nimport { applyPhoneMask } from '../utils/masks';");
  c = c.replace(/\{student\.phone\}\<\/span\>/g, "{student.phone ? applyPhoneMask(student.phone) : ''}</span>");
  c = c.replace(/<input name="phone" defaultValue=\{activeStudent\?\.phone\} type="text" style=\{\{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba\(0,0,0,0\.2\)', color: 'white' \}\} \/>/g, "<input name=\"phone\" defaultValue={activeStudent?.phone ? applyPhoneMask(activeStudent.phone) : ''} onChange={(e) => e.target.value = applyPhoneMask(e.target.value)} type=\"tel\" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }} />");
  fs.writeFileSync('web/src/components/ClassManagementProfessor.tsx', c);
  console.log('Patched ClassManagementProfessor');
}
