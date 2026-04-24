const fs = require('fs');
let code = fs.readFileSync('web/src/components/OpenAgenda.tsx', 'utf8');

// 1. Add AuthContext import
if (!code.includes('import { useAuth } from')) {
  code = code.replace(
    "import { Calendar, MapPin, DollarSign, Phone, Activity, Plus, ArrowLeft, Trash2, Edit } from 'lucide-react';",
    "import { Calendar, MapPin, DollarSign, Phone, Activity, Plus, ArrowLeft, Trash2, Edit, User as UserIcon } from 'lucide-react';\nimport { useAuth } from '../contexts/AuthContext';"
  );
}

// 2. Add professorPhotoUrl to Interface
if (!code.includes('professorPhotoUrl?: string;')) {
  code = code.replace(
    "  resumeSummary: string;",
    "  resumeSummary: string;\n  professorPhotoUrl?: string;"
  );
}

// 3. get currentUser
if (!code.includes('const { currentUser } = useAuth();')) {
  code = code.replace(
    "  const [slots, setSlots] = useState<AgendaSlot[]>([]);",
    "  const { currentUser } = useAuth();\n  const [slots, setSlots] = useState<AgendaSlot[]>([]);"
  );
}

// 4. pass professorPhotoUrl in handleSave
if (!code.includes('professorPhotoUrl: currentUser?.photoUrl || \'\'')) {
  code = code.replace(
    "const payload = { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary };",
    "const payload = { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary, professorPhotoUrl: currentUser?.photoUrl || '' };"
  );
}

// 5. Add Avatar in Card render
const oldCardHeader = `                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'white' }}>{slot.professorName}</h3>
                    
                    {/* Tags */}`;

const newCardHeader = `                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: slot.professorPhotoUrl ? \`url(\${slot.professorPhotoUrl}) center/cover\` : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {!slot.professorPhotoUrl && <UserIcon size={24} color="var(--text-secondary)" />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'white' }}>{slot.professorName}</h3>
                      
                      {/* Tags */}`;
                      
if (code.includes(oldCardHeader)) {
  code = code.replace(oldCardHeader, newCardHeader);
  code = code.replace(
    "                    </div>\n                  </div>\n                  \n                  {canEdit(slot) && (",
    "                      </div>\n                    </div>\n                  </div>\n                  \n                  {canEdit(slot) && ("
  );
} else {
  // alternative manual patch
  let cardTitleIdx = code.indexOf(`<h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'white' }}>{slot.professorName}</h3>`);
  if (cardTitleIdx !== -1 && !code.includes('className="avatar-container"')) {
     const before = code.substring(0, cardTitleIdx);
     const after = code.substring(cardTitleIdx);
     const idxReplace = before.lastIndexOf('<div>');
     if (idxReplace !== -1) {
       code = before.substring(0, idxReplace) + 
       `<div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }} className="avatar-container">
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: slot.professorPhotoUrl ? \`url(\${slot.professorPhotoUrl}) center/cover\` : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {!slot.professorPhotoUrl && <UserIcon size={28} color="var(--text-secondary)" />}
                    </div>
                    <div>` + after;
       code = code.replace(
          "                    </div>\n                  </div>\n                  \n                  {canEdit(slot) && (",
          "                    </div>\n                  </div>\n                  </div>\n                  \n                  {canEdit(slot) && ("
       );
     }
  }
}

fs.writeFileSync('web/src/components/OpenAgenda.tsx', code);
console.log('OpenAgenda UI updated!');
