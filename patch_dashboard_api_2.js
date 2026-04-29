const fs = require('fs');
const path = './web/src/components/ClassManagementProfessor.tsx';
let content = fs.readFileSync(path, 'utf8');

// 4. Delete Student
content = content.replace(
  /setStudents\(prev => prev\.filter\(s => s\.id !== student\.id\)\);/g,
  \`fetch(\\\`\${API_URL}/api/class-students/\${student.id}\\\`, { method: 'DELETE', headers: getAuthHeader() }); setStudents(prev => prev.filter(s => s.id !== student.id));\`
);

// 5. Delete Class
content = content.replace(
  /if\(window\.confirm\('Excluir esta aula\?'\)\) setClasses\(prev => prev\.filter\(c => c\.id !== cls\.id\)\);/g,
  \`if(window.confirm('Excluir esta aula?')) { fetch(\\\`\${API_URL}/api/classes/\${cls.id}\\\`, { method: 'DELETE', headers: getAuthHeader() }); setClasses(prev => prev.filter(c => c.id !== cls.id)); }\`
);

// 6. Change Class Status
content = content.replace(
  /setClasses\(prev => prev\.map\(c => c\.id === cls\.id \? \{ \.\.\.c, status: e\.target\.value \} : c\)\);/g,
  \`{
    const updated = { ...cls, status: e.target.value };
    fetch(\\\`\${API_URL}/api/classes/\${cls.id}\\\`, { method: 'PUT', headers: getAuthHeader(), body: JSON.stringify(updated) });
    setClasses(prev => prev.map(c => c.id === cls.id ? updated : c));
  }\`
);

// 7. Change Class willHaveReplacement
content = content.replace(
  /setClasses\(prev => prev\.map\(c => c\.id === cls\.id \? \{ \.\.\.c, willHaveReplacement: e\.target\.checked \} : c\)\);/g,
  \`{
    const updated = { ...cls, willHaveReplacement: e.target.checked };
    fetch(\\\`\${API_URL}/api/classes/\${cls.id}\\\`, { method: 'PUT', headers: getAuthHeader(), body: JSON.stringify(updated) });
    setClasses(prev => prev.map(c => c.id === cls.id ? updated : c));
  }\`
);

// 8. Save Student Form
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

// 9. Save Bulk Classes Form
content = content.replace(
  /setClasses\(prev => \[\.\.\.prev, \.\.\.newClasses\]\);/g,
  \`newClasses.forEach(nc => fetch(\\\`\${API_URL}/api/classes\\\`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(nc) })); setClasses(prev => [...prev, ...newClasses]);\`
);

// 10. Save Single Class Form
content = content.replace(
  /setClasses\(prev => \[\.\.\.prev, classData\]\);/g,
  \`fetch(\\\`\${API_URL}/api/classes\\\`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(classData) }); setClasses(prev => [...prev, classData]);\`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed API integration in ClassManagementProfessor.tsx');
