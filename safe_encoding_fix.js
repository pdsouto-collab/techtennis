const fs = require('fs');
const file = 'web/src/components/StringerDashboard.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/PadrÃ£o de cordas/g, 'Padrão de cordas');
c = c.replace(/ObservaÃ§Ãµes/g, 'Observações');
c = c.replace(/EquilÃ­brio/g, 'Equilíbrio');
c = c.replace(/kgcmÂ²/g, 'kgcm²');
c = c.replace(/Ãndice Polar/g, 'Índice Polar');
c = c.replace(/Rigidez DinÃ¢mica/g, 'Rigidez Dinâmica');
c = c.replace(/Salvar AlteraÃ§Ãµes/g, 'Salvar Alterações');
c = c.replace(/TÃªnis/g, 'Tênis');
c = c.replace(/PreÃ§o AutomÃ¡tico/g, 'Preço Automático');
c = c.replace(/NÃ£o Ã© possÃvel salvar: o cliente jÃ¡ possui/g, 'Não é possível salvar: o cliente já possui');
c = c.replace(/\[CÃ³pia\]/g, '[Cópia]');

fs.writeFileSync(file, c, 'utf8');
console.log('Fixed encodings safely!');
