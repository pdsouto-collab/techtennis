const fs = require('fs');
let file = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

const oldTarget = `                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const newProf = {
                        name: fd.get('name') as string,
                        email: fd.get('email') as string,
                        phone: fd.get('phone') as string,
                        yearsOfExperience: fd.get('yearsOfExperience') as string,
                        trainingTypes: fd.get('trainingTypes') as string
                      };`;

const newTarget = `                  <form key={selectedProfessor?.id || 'new'} onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const newProf = {
                        name: fd.get('name') as string,
                        email: fd.get('email') as string,
                        phone: fd.get('phone') as string,
                        yearsOfExperience: fd.get('yearsOfExperience') as string,
                        trainingTypes: fd.get('trainingTypes') as string,
                        numericId: fd.get('numericId') ? parseInt(fd.get('numericId') as string, 10) : undefined
                      };`;

if(file.includes(oldTarget)) {
  file = file.replace(oldTarget, newTarget);
  fs.writeFileSync('src/components/StringerDashboard.tsx', file);
  console.log('Successfully fixed StringerDashboard');
} else {
  console.error("String NOT found! Checking if windows CRLF is an issue...");
  // Use regex
  const regex = /<form onSubmit=\{async \(e\) => \{\s*e\.preventDefault\(\);\s*const fd = new FormData\(e\.currentTarget\);\s*const newProf = \{\s*name: fd\.get\('name'\) as string,\s*email: fd\.get\('email'\) as string,\s*phone: fd\.get\('phone'\) as string,\s*yearsOfExperience: fd\.get\('yearsOfExperience'\) as string,\s*trainingTypes: fd\.get\('trainingTypes'\) as string\s*\};/;
  
  if (regex.test(file)) {
      file = file.replace(regex, newTarget);
      fs.writeFileSync('src/components/StringerDashboard.tsx', file);
      console.log('Successfully fixed StringerDashboard via regex');
  } else {
      console.log('Could not match regex either');
  }
}
