const fs = require('fs');

const pathP = 'web/src/components/ClassManagementProfessor.tsx';
let pContent = fs.readFileSync(pathP, 'utf8');

// Replace classes localStorage state with DB fetch
pContent = pContent.replace(
  `const [classes, setClasses] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_classes');
    return saved ? JSON.parse(saved) : [];
  });`,
  `const [classes, setClasses] = useState<any[]>([]);
  
  const fetchClasses = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/classes', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('tt_auth_token') }
      });
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch(err) { console.error(err); }
  };
  useEffect(() => { fetchClasses(); }, []);`
);

// Remove classes localStorage effect
pContent = pContent.replace(
  `useEffect(() => { localStorage.setItem('tt_classes', JSON.stringify(classes)); }, [classes]);`,
  ``
);

// We need to inject logic to POST /api/classes when creating.
// Since the code has two places (bulk and single), it's easier to proxy setClasses. But replacing setClasses directly in the submit is better.
pContent = pContent.replace(
'const newClasses: any[] = [];',
`const newClasses: any[] = [];`
);

pContent = pContent.replace(
`setClasses(prev => [...prev, ...newClasses]);`,
`for (const c of newClasses) {
    await fetch(import.meta.env.VITE_API_URL + '/api/classes', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('tt_auth_token') },
      body: JSON.stringify(c)
    });
}
await fetchClasses();`
);

pContent = pContent.replace(
`setClasses(prev => [...prev, classData]);`,
`await fetch(import.meta.env.VITE_API_URL + '/api/classes', {
  method: 'POST',
  headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('tt_auth_token') },
  body: JSON.stringify(classData)
});
await fetchClasses();`
);

// For status update
pContent = pContent.replace(
`setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, status: e.target.value } : c));`,
`fetch(import.meta.env.VITE_API_URL + '/api/classes/' + cls.id, {
  method: 'PUT',
  headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('tt_auth_token') },
  body: JSON.stringify({ ...cls, status: e.target.value })
}).then(() => fetchClasses());`
);

pContent = pContent.replace(
`setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, willHaveReplacement: e.target.checked } : c));`,
`fetch(import.meta.env.VITE_API_URL + '/api/classes/' + cls.id, {
  method: 'PUT',
  headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('tt_auth_token') },
  body: JSON.stringify({ ...cls, willHaveReplacement: e.target.checked })
}).then(() => fetchClasses());`
);

// Fix async warning for the onSubmit form
pContent = pContent.replace(
`onSubmit={(e) => {`,
`onSubmit={async (e) => {`
);

// Delete
pContent = pContent.replace(
`if(window.confirm('Excluir esta aula?')) setClasses(prev => prev.filter(c => c.id !== cls.id));`,
`if(window.confirm('Excluir esta aula?')) {
  fetch(import.meta.env.VITE_API_URL + '/api/classes/' + cls.id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('tt_auth_token') }
  }).then(() => fetchClasses());
}`
);

fs.writeFileSync(pathP, pContent);

// NOW CUSTOMER 
const pathC = 'web/src/components/ClassManagementCustomer.tsx';
let cContent = fs.readFileSync(pathC, 'utf8');

cContent = cContent.replace(
  `const [classes] = useState<any[]>(() => {
    const saved = localStorage.getItem('tt_classes');
    return saved ? JSON.parse(saved) : [];
  });`,
  `const [classes, setClasses] = useState<any[]>([]);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/classes', {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('tt_auth_token') }
        });
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
        }
      } catch(err) { console.error(err); }
    };
    fetchClasses();
  }, []);`
);

fs.writeFileSync(pathC, cContent);

console.log("Classes bypass done.");
