const fs = require('fs');

const file = 'web/src/components/StringerDashboard.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/N.*o .* poss.*vel salvar: o cliente j.* possui/g, 'Não é possível salvar: o cliente já possui');
c = c.replace(/Padr.*o de cordas/g, 'Padrão de cordas');
c = c.replace(/Observa.*es/g, 'Observações');
c = c.replace(/Equil.*brio/g, 'Equilíbrio');
c = c.replace(/kgcm.*/g, 'kgcm²)');
c = c.replace(/.*ndice Polar/g, 'Índice Polar');
c = c.replace(/Rigidez Din.*mica/g, 'Rigidez Dinâmica');
c = c.replace(/Salvar Altera.*/g, 'Salvar Alterações</button>');
c = c.replace(/TÃªnis/g, 'Tênis');
c = c.replace(/T.*nis/g, 'Tênis');
c = c.replace(/PreA o AutomAtico/g, 'Preço Automático');

// Clean up
c = c.replace(/kgcm²\)\)/g, 'kgcm²)');
c = c.replace(/<\/button><\/button>/g, '</button>');

fs.writeFileSync(file, c, 'utf8');
console.log('Fixed regex matches!');
