const fs = require('fs');

const file = 'web/src/components/StringerDashboard.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/fetch\(\`\$\{API_URL\}\/api\/rackets\/\$\{racketFormDefault\.id\}\`, \{\s*method: 'PUT',\s*headers: \{ \.\.\.getAuthHeader\(\), 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(payload\)\s*\}\)\.then\(\(\) => fetchRackets\(\)\);/m, 
`fetch(\`\$\{API_URL\}/api/rackets/\$\{racketFormDefault.id\}\`, {
   method: 'PUT',
   headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
   body: JSON.stringify(payload)
 }).then(async (res) => {
   if (!res.ok) {
     const data = await res.json().catch(() => ({}));
     alert(data.error || 'Erro ao salvar a raquete.');
   } else {
     await fetchRackets();
     setIsRacketModalOpen(false);
   }
 });`);

c = c.replace(/fetch\(\`\$\{API_URL\}\/api\/rackets\`, \{\s*method: 'POST',\s*headers: \{ \.\.\.getAuthHeader\(\), 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(\{ \.\.\.payload, customerId \}\)\s*\}\)\.then\(\(\) => fetchRackets\(\)\);/m,
`fetch(\`\$\{API_URL\}/api/rackets\`, {
   method: 'POST',
   headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
   body: JSON.stringify({ ...payload, customerId })
 }).then(async (res) => {
   if (!res.ok) {
     const data = await res.json().catch(() => ({}));
     alert(data.error || 'Erro ao criar a raquete.');
   } else {
     await fetchRackets();
     setIsRacketModalOpen(false);
   }
 });`);

// Now REMOVE the unconditional setIsRacketModalOpen(false) at the end of the form submit block!
// Looking closely, there are multiple "setIsRacketModalOpen(false);" lines. One inside onSubmit and one inside button onClick.
// We must only remove the one at the end of the `onSubmit`!
const onSubmitBlockEnd = `}).then(() => fetchRackets());
                    }
                    setIsRacketModalOpen(false); 
                  }}>`;

c = c.replace(`setIsRacketModalOpen(false); \n                  }}>`, `                  }}>`);

fs.writeFileSync(file, c);
console.log('Fixed racket fetch to be safe!');
