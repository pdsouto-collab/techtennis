const fs = require('fs');
const path = './web/src/components/OrderDetailsView.tsx';

let content = fs.readFileSync(path, 'utf8');

// Add API helpers
if (!content.includes('const API_URL')) {
    content = content.replace(
        'export const OrderDetailsView = ({',
        `const API_URL = import.meta.env.VITE_API_URL || 'https://techtennis-api.vercel.app';
const getAuthHeader = () => {
  const token = localStorage.getItem('tt_auth_token');
  return { 'Authorization': \`Bearer \${token}\` };
};

export const OrderDetailsView = ({`
    );
}

// 1. Pagamento
content = content.replace(
    /setJobs\(jobs\.map\(\(j:any\) => j\.customerName === activeOrderJob\.customerName \? \{ \.\.\.j, paid: true \} : j\)\);/g,
    `setJobs(jobs.map((j:any) => j.customerName === activeOrderJob.customerName ? { ...j, paid: true } : j));
                    for (let j of jobs) {
                       if(j.customerName === activeOrderJob.customerName && !j.paid) {
                           fetch(\`\${API_URL}/api/jobs/\${j.id}/status\`, {
                              method: 'PUT', headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                              body: JSON.stringify({ paid: true })
                           }).catch(console.error);
                       }
                    }`
);

content = content.replace(
    /setJobs\(jobs\.map\(\(j:any\) => j\.customerName === activeOrderJob\.customerName \? \{ \.\.\.j, paid: false \} : j\)\);/g,
    `setJobs(jobs.map((j:any) => j.customerName === activeOrderJob.customerName ? { ...j, paid: false } : j));
                    for (let j of jobs) {
                       if(j.customerName === activeOrderJob.customerName && j.paid) {
                           fetch(\`\${API_URL}/api/jobs/\${j.id}/status\`, {
                              method: 'PUT', headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                              body: JSON.stringify({ paid: false })
                           }).catch(console.error);
                       }
                    }`
);

// 2. Previsão de Retirada
content = content.replace(
    /const updatedJobs = jobs\.map\(\(j: any\) => j\.customerName === activeOrderJob\.customerName \? \{ \.\.\.j, pickupDate, pickupNotes \} : j\);\n\s*setJobs\(updatedJobs\);/g,
    `const updatedJobs = jobs.map((j: any) => j.customerName === activeOrderJob.customerName ? { ...j, pickupDate, pickupNotes } : j);
                    setJobs(updatedJobs);
                    for (let j of jobs) {
                       if(j.customerName === activeOrderJob.customerName) {
                           fetch(\`\${API_URL}/api/jobs/\${j.id}\`, {
                              method: 'PUT', headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...j, pickupDate, pickupNotes })
                           }).catch(console.error);
                       }
                    }`
);

// 3. Notas
content = content.replace(
    /setIsNotesModalOpen\(false\);\n\s*\}\} \/>/g,
    `setIsNotesModalOpen(false);
          const activeCustomer = customers?.find((c: any) => c.name === activeOrderJob.customerName);
          if (activeCustomer) {
             fetch(\`\${API_URL}/api/customers/\${activeCustomer.id}\`, {
                 method: 'PUT',
                 headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                 body: JSON.stringify({ ...activeCustomer, notes })
             }).catch(console.error);
          }
      }} />`
);

// 4. Checkboxes Rolo próprio e Set próprio
content = content.replace(
    /<input type="checkbox" style=\{\{ accentColor: '#D93B65', width: '22px', height: '22px' \}\} \/>/g,
    function(match, offset, string) {
        if (string.substring(offset - 40, offset).includes('Rolo próprio')) {
            return `<input type="checkbox" checked={activeOrderJob?.hasOwnReel || false} onChange={(e) => {
             const val = e.target.checked;
             setJobs(jobs.map((j:any) => j.id === activeOrderJob.id ? { ...j, hasOwnReel: val } : j));
             fetch(\`\${API_URL}/api/jobs/\${activeOrderJob.id}\`, { method: 'PUT', headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify({ ...activeOrderJob, hasOwnReel: val }) }).catch(console.error);
          }} style={{ accentColor: '#D93B65', width: '22px', height: '22px' }} />`;
        } else {
            return `<input type="checkbox" checked={activeOrderJob?.hasOwnSet || false} onChange={(e) => {
             const val = e.target.checked;
             setJobs(jobs.map((j:any) => j.id === activeOrderJob.id ? { ...j, hasOwnSet: val } : j));
             fetch(\`\${API_URL}/api/jobs/\${activeOrderJob.id}\`, { method: 'PUT', headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify({ ...activeOrderJob, hasOwnSet: val }) }).catch(console.error);
          }} style={{ accentColor: '#D93B65', width: '22px', height: '22px' }} />`;
        }
    }
);

// We should also load notes initially from activeCustomer if they exist.
content = content.replace(
    /const savedNotes = localStorage\.getItem\('tt_customer_notes_' \+ activeOrderJob\.customerName\);\n\s*setCustomerNotes\(savedNotes \? JSON\.parse\(savedNotes\) : \[\]\);/g,
    `const activeC = customers?.find((c: any) => c.name === activeOrderJob.customerName);
           if (activeC && activeC.notes) {
              setCustomerNotes(typeof activeC.notes === 'string' ? JSON.parse(activeC.notes) : activeC.notes);
           } else {
              const savedNotes = localStorage.getItem('tt_customer_notes_' + activeOrderJob.customerName);
              setCustomerNotes(savedNotes ? JSON.parse(savedNotes) : []);
           }`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Frontend OrderDetailsView.tsx patched successfully!');
