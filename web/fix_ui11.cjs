const fs = require('fs');
let file = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

const regexSearchBar = /<div style=\{\{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, justifyContent: 'flex-end', marginLeft: '24px' \}\}>[\s\S]*?<input type="text" placeholder="Busca avan\u00E7ada: nome, clube, email, fone\.\.\."[\s\S]*?<\/div>/;

// Also match with standard character if unicode failed:
const regexSearchBarAlt = /<div style=\{\{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, justifyContent: 'flex-end', marginLeft: '24px' \}\}>.*?\n.*?<Search.*?\n.*?<input type="text" placeholder="Busca avan[^"]+".*?<\/div>/s;


const newSearchBar = `<div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'flex-end', marginLeft: '24px' }}>
                    {activeCustomerFiltersCount > 0 && (
                      <button onClick={() => setCustomerFilters({ name: '', numericId: '', originClub: '', professorId: '', email: '', phone: '', stringingPoint: '' })} style={{ background: 'transparent', border: 'none', color: '#FECACA', fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                        Limpar Filtros
                      </button>
                    )}
                    <button className="button-primary" style={{ padding: '8px 16px', fontSize: '14px', background: activeCustomerFiltersCount > 0 ? '#6136B3' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '24px', display: 'flex', gap: '6px', alignItems: 'center' }} onClick={() => setIsCustomerSearchModalOpen(true)}>
                      <Search size={16} /> Busca Avançada {activeCustomerFiltersCount > 0 && \`(\${activeCustomerFiltersCount})\`}
                    </button>
                  </div>`;

if(file.match(regexSearchBarAlt)) {
    file = file.replace(regexSearchBarAlt, newSearchBar);
    console.log('Search interface replaced!');
} else {
    console.log('Could not match search interface!');
}

const filterLogic1 = `if (!customerListSearch.trim()) return true;
                        const q = customerListSearch.toLowerCase();
                        return (
                           (c.name || '').toLowerCase().includes(q) ||
                           (c.email || '').toLowerCase().includes(q) ||
                           (c.phone || '').toLowerCase().includes(q) ||
                           (c.landline || '').toLowerCase().includes(q) ||
                           (c.originClub || '').toLowerCase().includes(q) ||
                           (c.cpfCnpj || '').toLowerCase().includes(q)
                        );`;
const filterLogic2 = `if (!customerListSearch.trim()) return true;
                     const q = customerListSearch.toLowerCase();
                     return (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q) || (c.landline || '').toLowerCase().includes(q) || (c.originClub || '').toLowerCase().includes(q) || (c.cpfCnpj || '').toLowerCase().includes(q);`;

const newFilterLogic = `                      let matches = true;
                      if (customerFilters.name) matches = matches && (c.name || '').toLowerCase().includes(customerFilters.name.toLowerCase());
                      if (customerFilters.email) matches = matches && (c.email || '').toLowerCase().includes(customerFilters.email.toLowerCase());
                      if (customerFilters.phone) matches = matches && ((c.phone || '').includes(customerFilters.phone) || (c.landline || '').includes(customerFilters.phone));
                      if (customerFilters.originClub) matches = matches && c.originClub === customerFilters.originClub;
                      if (customerFilters.professorId) matches = matches && c.professorId === customerFilters.professorId;
                      if (customerFilters.stringingPoint) matches = matches && c.stringingPoint === customerFilters.stringingPoint;
                      if (customerFilters.numericId) {
                        const q = customerFilters.numericId.trim();
                        if (q.includes(',')) {
                          const parts = q.split(',').map(s => s.trim());
                          matches = matches && parts.includes(String(c.numericId));
                        } else if (q.includes('-')) {
                          const parts = q.split('-').map(s => parseInt(s.trim(), 10));
                          const min = parts[0];
                          const max = parts[1];
                          const val = parseInt(c.numericId, 10);
                          if (!isNaN(min) && !isNaN(max) && !isNaN(val)) {
                            matches = matches && (val >= min && val <= max);
                          } else {
                            matches = false;
                          }
                        } else {
                          matches = matches && String(c.numericId || '').includes(q);
                        }
                      }
                      return matches;`;

if(file.includes(filterLogic1)) {
    file = file.replace(filterLogic1, newFilterLogic);
    console.log('Filter logic 1 replaced!');
} else {
    console.log('Filter logic 1 not found!');
}
if(file.includes(filterLogic2)) {
    file = file.replace(filterLogic2, newFilterLogic.replace(/                      /g, '                     '));
    console.log('Filter logic 2 replaced!');
} else {
    console.log('Filter logic 2 not found!');
}

fs.writeFileSync('src/components/StringerDashboard.tsx', file);
