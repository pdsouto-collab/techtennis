const fs = require('fs');

const file = 'web/src/components/StringerDashboard.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/setRacketFormDefault\(\{.*?\}\);\s*setIsCloneRacketModalOpen\(false\);\s*setIsRacketModalOpen\(true\);/g, `setRacketFormDefault({ ...racket, name: racket.name, identifier: '', isClone: true });
                            setIsCloneRacketModalOpen(false);
                            setIsRacketModalOpen(true);`);

fs.writeFileSync(file, c, 'utf8');
console.log('Fixed clone copying spread!');
