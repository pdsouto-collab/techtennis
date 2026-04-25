const fs = require('fs');
let c = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

c = c.replace(/<form onSubmit=\{\(e\) => \{\n\s*e\.preventDefault\(\);\n\s*const fd = new FormData\(e\.currentTarget\);\n\s*const newProf/, 
`<form onSubmit={async (e) => {\n                    e.preventDefault();\n                    const fd = new FormData(e.currentTarget);\n                    const newProf`);

const customerOldLogic = `if (selectedCustomer) {
                      fetch(\`\${API_URL}/api/customers/\${selectedCustomer.id}\`, {
                        method: 'PUT',
                        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify(customerData)
                      }).then(() => fetchCustomers());
                    } else {
                      fetch(\`\${API_URL}/api/customers\`, {
                        method: 'POST',
                        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify(customerData)
                      }).then(res => res.json()).then((data) => {
                         fetchCustomers();
                         setSelectedCustomer(data);
                         setCustomerQuery(data.name);
                      });
                    }
                    setIsCustomerModalOpen(false);`;

const customerNewLogic = `try {
                      if (selectedCustomer) {
                        const res = await fetch(\`\${API_URL}/api/customers/\${selectedCustomer.id}\`, {
                          method: 'PUT',
                          headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                          body: JSON.stringify(customerData)
                        });
                        if (!res.ok) throw new Error(await res.text() || 'API Error');
                        await fetchCustomers();
                      } else {
                        const res = await fetch(\`\${API_URL}/api/customers\`, {
                          method: 'POST',
                          headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                          body: JSON.stringify(customerData)
                        });
                        if (!res.ok) throw new Error(await res.text() || 'API Error');
                        const data = await res.json();
                        await fetchCustomers();
                        setSelectedCustomer(data);
                        setCustomerQuery(data.name);
                      }
                      setIsCustomerModalOpen(false); 
                    } catch (err: any) {
                      console.error("Error saving customer:", err);
                      alert("Erro ao salvar cliente. Detalhes: " + err.message);
                    }`;

const customerFormTagOld = `<form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => { 
                    e.preventDefault(); 
                    const fd = new FormData(e.currentTarget);
                    const firstName = fd.get('firstName') as string;`;
const customerFormTagNew = `<form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={async (e) => { 
                    e.preventDefault(); 
                    const fd = new FormData(e.currentTarget);
                    const firstName = fd.get('firstName') as string;`;

if(c.includes(customerOldLogic)) c = c.replace(customerOldLogic, customerNewLogic);
if(c.includes(customerFormTagOld)) c = c.replace(customerFormTagOld, customerFormTagNew);

fs.writeFileSync('src/components/StringerDashboard.tsx', c);
console.log("Success");
