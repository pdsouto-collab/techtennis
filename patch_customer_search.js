const fs = require('fs');
const path = './web/src/components/CustomerSingleClass.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/const \[activeMatch, setActiveMatch\] = useState<any>\(null\);/, `
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [searchAttempts, setSearchAttempts] = useState(0);
`);

// The search button just sets phase to searching and resets attempts
content = content.replace(
  /onClick=\{async \(\) => \{[\s\S]*?\}\} className="button-primary"/,
  `onClick={() => {
    setSearchAttempts(0);
    setPhase('searching');
  }} className="button-primary"`
);

// We need a useEffect for searching phase
content = content.replace(
  /useEffect\(\(\) => \{\s*\/\/ Phase search logic handles via DB polling now\s*\}, \[phase\]\);[\s\S]*?useEffect\(\(\) => \{\s*if \(phase === 'searching'\) \{[\s\S]*?\}\s*\}, \[phase\]\);/,
  `useEffect(() => {
    let timeout: any;
    if (phase === 'searching' && !activeMatch) {
      if (searchAttempts > 18) { // 18 * 5 = 90 seconds
        alert('Nenhum professor encontrado na sua região no momento.');
        setPhase('config');
        return;
      }
      const doSearch = async () => {
        try {
          const profRes = await fetch(\`\${API_URL}/api/single-class/search\`, { headers: getAuthHeader() });
          if (profRes.ok) {
            const prof = await profRes.json();
            if (prof && prof.professorId) {
              setProfessorDetails(prof);
              const matchRes = await fetch(\`\${API_URL}/api/single-class/match\`, {
                method: 'POST',
                headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ professorId: prof.professorId, objective })
              });
              if (matchRes.ok) {
                setActiveMatch(await matchRes.json());
                return;
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
        timeout = setTimeout(() => setSearchAttempts(prev => prev + 1), 5000);
      };
      doSearch();
    }
    return () => clearTimeout(timeout);
  }, [phase, searchAttempts, activeMatch]);`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed search polling');
