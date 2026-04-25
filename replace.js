const fs = require('fs');
let c = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');

c = c.replace(/if \(selectedProfessor && selectedProfessor\.id\) \{[\s\S]*?setSelectedProfessor\(null\);/, 
`                  try {
                    let res;
                    if (selectedProfessor && selectedProfessor.id) {
                       res = await fetch(\`\${API_URL}/api/professors/\${selectedProfessor.id}\`, { method: 'PUT', headers: {...getAuthHeader(), 'Content-Type': 'application/json'}, body: JSON.stringify(newProf) });
                    } else {
                       res = await fetch(\`\${API_URL}/api/professors\`, { method: 'POST', headers: {...getAuthHeader(), 'Content-Type': 'application/json'}, body: JSON.stringify(newProf) });
                    }
                    if (!res.ok) {
                        const errText = await res.text();
                        throw new Error(errText || 'Erro da API');
                    }
                    await fetchProfessors();
                    setIsProfessorModalOpen(false);
                    setSelectedProfessor(null);
                  } catch(e: any) {
                    console.error('Error saving professor:', e);
                    alert('Falha ao salvar professor. Verifique os dados. (' + e.message + ')');
                  }`);

fs.writeFileSync('web/src/components/StringerDashboard.tsx', c);
console.log("Done");
