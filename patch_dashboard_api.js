const fs = require('fs');
const path = './web/src/components/ClassManagementProfessor.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Initial State for students and classes
content = content.replace(
  /const \[students, setStudents\] = useState<any\[\]>\(\(\) => \{\s*const saved = localStorage\.getItem\('tt_class_students'\);\s*return saved \? JSON\.parse\(saved\) : \[\];\s*\}\);/g,
  `const [students, setStudents] = useState<any[]>([]);`
);

content = content.replace(
  /const \[classes, setClasses\] = useState<any\[\]>\(\(\) => \{\s*const saved = localStorage\.getItem\('tt_classes'\);\s*return saved \? JSON\.parse\(saved\) : \[\];\s*\}\);/g,
  `const [classes, setClasses] = useState<any[]>([]);`
);

// 2. Remove local storage effect sync
content = content.replace(/useEffect\(\(\) => \{ localStorage\.setItem\('tt_class_students', JSON\.stringify\(students\)\); \}, \[students\]\);/g, '');
content = content.replace(/useEffect\(\(\) => \{ localStorage\.setItem\('tt_classes', JSON\.stringify\(classes\)\); \}, \[classes\]\);/g, '');

// 3. Add getAuthHeader and fetchData inside the component (after const API_URL)
const fetchLogic = \`
  const getAuthHeader = () => {
    const token = localStorage.getItem('tt_auth_token');
    return { 'Authorization': \`Bearer \${token}\`, 'Content-Type': 'application/json' };
  };

  const fetchData = async () => {
    try {
      const [stdRes, clsRes] = await Promise.all([
        fetch(\`\${API_URL}/api/class-students\`, { headers: getAuthHeader() }),
        fetch(\`\${API_URL}/api/classes\`, { headers: getAuthHeader() })
      ]);
      if (stdRes.ok) setStudents(await stdRes.json());
      if (clsRes.ok) setClasses(await clsRes.json());
    } catch (e) {
      console.error('Error fetching class data', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
\`;
content = content.replace(/const API_URL = import\.meta\.env\.VITE_API_URL \|\| "http:\/\/localhost:3001";/, \`const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";\n\${fetchLogic}\`);

// 4. Delete Student (line ~128)
content = content.replace(
  /setStudents\(prev => prev\.filter\(s => s\.id !== student\.id\)\);/g,
  \`fetch(\\\`\${API_URL}/api/class-students/\${student.id}\\\`, { method: 'DELETE', headers: getAuthHeader() }); setStudents(prev => prev.filter(s => s.id !== student.id));\`
);

// 5. Delete Class (line ~249)
content = content.replace(
  /if\(window\.confirm\('Excluir esta aula\?'\)\) setClasses\(prev => prev\.filter\(c => c\.id !== cls\.id\)\);/g,
  \`if(window.confirm('Excluir esta aula?')) { fetch(\\\`\${API_URL}/api/classes/\${cls.id}\\\`, { method: 'DELETE', headers: getAuthHeader() }); setClasses(prev => prev.filter(c => c.id !== cls.id)); }\`
);

// 6. Change Class Status (line ~225)
content = content.replace(
  /setClasses\(prev => prev\.map\(c => c\.id === cls\.id \? \{ \.\.\.c, status: e\.target\.value \} : c\)\);/g,
  \`{
    const updated = { ...cls, status: e.target.value };
    fetch(\\\`\${API_URL}/api/classes/\${cls.id}\\\`, { method: 'PUT', headers: getAuthHeader(), body: JSON.stringify(updated) });
    setClasses(prev => prev.map(c => c.id === cls.id ? updated : c));
  }\`
);

// 7. Change Class willHaveReplacement (line ~240)
content = content.replace(
  /setClasses\(prev => prev\.map\(c => c\.id === cls\.id \? \{ \.\.\.c, willHaveReplacement: e\.target\.checked \} : c\)\);/g,
  \`{
    const updated = { ...cls, willHaveReplacement: e.target.checked };
    fetch(\\\`\${API_URL}/api/classes/\${cls.id}\\\`, { method: 'PUT', headers: getAuthHeader(), body: JSON.stringify(updated) });
    setClasses(prev => prev.map(c => c.id === cls.id ? updated : c));
  }\`
);

// 8. Save Student Form (line ~412)
content = content.replace(
  /if \(activeStudent\) \{\s*setStudents\(prev => prev\.map\(s => s\.id === activeStudent\.id \? studentData : s\)\);\s*\} else \{\s*setStudents\(prev => \[\.\.\.prev, studentData\]\);\s*\}/,
  \`if (activeStudent) {
    fetch(\\\`\${API_URL}/api/class-students/\${activeStudent.id}\\\`, { method: 'PUT', headers: getAuthHeader(), body: JSON.stringify(studentData) });
    setStudents(prev => prev.map(s => s.id === activeStudent.id ? studentData : s));
  } else {
    fetch(\\\`\${API_URL}/api/class-students\\\`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(studentData) });
    setStudents(prev => [...prev, studentData]);
  }\`
);

// 9. Save Bulk Classes Form (line ~532)
content = content.replace(
  /setClasses\(prev => \[\.\.\.prev, \.\.\.newClasses\]\);/g,
  \`newClasses.forEach(nc => fetch(\\\`\${API_URL}/api/classes\\\`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(nc) })); setClasses(prev => [...prev, ...newClasses]);\`
);

// 10. Save Single Class Form (line ~544)
content = content.replace(
  /setClasses\(prev => \[\.\.\.prev, classData\]\);/g,
  \`fetch(\\\`\${API_URL}/api/classes\\\`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(classData) }); setClasses(prev => [...prev, classData]);\`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed API integration in ClassManagementProfessor.tsx');
