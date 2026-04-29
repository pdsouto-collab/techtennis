const fs = require('fs');
const path = './web/src/components/RacketCollection.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove Package from imports
content = content.replace(
  /import \{ ArrowLeft, DollarSign, Calendar as CalendarIcon, Package, Plus, Edit, Trash2, X \} from 'lucide-react';/,
  "import { ArrowLeft, DollarSign, Calendar as CalendarIcon, Plus, Edit, Trash2, X } from 'lucide-react';"
);

// 2. Add TennisRacket icon definition right after the imports
const racketIconDef = \`
const TennisRacket = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.18 16.59C15.86 19.34 19.92 18.79 21.24 17.03C22.56 15.27 21.6 11.83 17.92 9.08C14.24 6.33 10.18 6.88 8.86 8.64C7.54 10.4 8.5 13.84 12.18 16.59Z" />
    <path d="M9.8 11.2L2.6 18.4L5.6 21.4L12.8 14.2" />
    <path d="M11 15L15 10" />
    <path d="M13 17L17 12" />
    <path d="M15 19L19 14" />
  </svg>
);
\`;

content = content.replace(
  /export const RacketCollection = \(\) => \{/,
  racketIconDef + '\nexport const RacketCollection = () => {'
);

// 3. Replace the Package component usage
content = content.replace(
  /<Package size=\{20\} color="#4298E7" \/>/,
  '<TennisRacket size={20} color="#4298E7" />'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed racket icon');
