const fs = require('fs');
let file = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

const regexNewProf = /const newProf = \{\s*name: fd\.get\('name'\) as string,\s*email: fd\.get\('email'\) as string,\s*phone: fd\.get\('phone'\) as string,\s*yearsOfExperience: fd\.get\('yearsOfExperience'\) as string,\s*trainingTypes: fd\.get\('trainingTypes'\) as string\s*\};/g;

const newProfBlock = `const newProf = {
  name: fd.get('name') as string,
  email: fd.get('email') as string,
  phone: fd.get('phone') as string,
  yearsOfExperience: fd.get('yearsOfExperience') as string,
  trainingTypes: fd.get('trainingTypes') as string,
  numericId: fd.get('numericId') ? parseInt(fd.get('numericId') as string, 10) : undefined
};`;

file = file.replace(regexNewProf, newProfBlock);

file = file.replace(
  `<form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={async (e) => {`,
  `<form key={selectedProfessor?.id || 'new'} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={async (e) => {`
);

fs.writeFileSync('src/components/StringerDashboard.tsx', file);
console.log('Fixed UI reactivity and payload issue');
