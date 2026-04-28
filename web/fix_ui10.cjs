const fs = require('fs');
let file = fs.readFileSync('src/components/StringerDashboard.tsx', 'utf8');

// 1. Add state for advanced search
const regexSearchState = /const \[customerListSearch, setCustomerListSearch\] = useState\(''\);/;
const stateReplace = `const [customerFilters, setCustomerFilters] = useState({ name: '', numericId: '', originClub: '', professorId: '', email: '', phone: '', stringingPoint: '' });
  const [isCustomerSearchModalOpen, setIsCustomerSearchModalOpen] = useState(false);
  const activeCustomerFiltersCount = Object.values(customerFilters).filter(v => typeof v === 'string' && v.trim() !== '').length;`;

file = file.replace(regexSearchState, stateReplace);

// 2. Replace the search input
const filterLogicInView = `return (
                           (c.name || '').toLowerCase().includes(q) ||
                           (c.email || '').toLowerCase().includes(q) ||
                           (c.phone || '').toLowerCase().includes(q) ||
                           (c.landline || '').toLowerCase().includes(q) ||
                           (c.originClub || '').toLowerCase().includes(q) ||
                           (c.cpfCnpj || '').toLowerCase().includes(q)
                        );`;

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

// Table filter replacement (there are two, one for pagination and one for drawing)
const filterBlock1 = `if (!customerListSearch.trim()) return true;
                        const q = customerListSearch.toLowerCase();
                        return (
                           (c.name || '').toLowerCase().includes(q) ||
                           (c.email || '').toLowerCase().includes(q) ||
                           (c.phone || '').toLowerCase().includes(q) ||
                           (c.landline || '').toLowerCase().includes(q) ||
                           (c.originClub || '').toLowerCase().includes(q) ||
                           (c.cpfCnpj || '').toLowerCase().includes(q)
                        );`;
file = file.replace(filterBlock1, newFilterLogic);

const filterBlock2 = `if (!customerListSearch.trim()) return true;
                     const q = customerListSearch.toLowerCase();
                     return (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q) || (c.landline || '').toLowerCase().includes(q) || (c.originClub || '').toLowerCase().includes(q) || (c.cpfCnpj || '').toLowerCase().includes(q);`;
file = file.replace(filterBlock2, newFilterLogic.replace(/                      /g, '                     '));


// 3. UI Replacement (Search bar -> Advanced Search Button)
const oldSearchBar = `                  <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'rgba(255,255,255,0.5)' }} size={16} />
                    <input type="text" placeholder="Busca avançada: nome, clube, email, fone..." value={customerListSearch} onChange={(e) => setCustomerListSearch(e.target.value)} style={{ padding: '8px 16px 8px 36px', borderRadius: '24px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', width: '320px', fontSize: '14px', outline: 'none' }} />
                  </div>`;
const newSearchBar = `                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {activeCustomerFiltersCount > 0 && (
                      <button onClick={() => setCustomerFilters({ name: '', numericId: '', originClub: '', professorId: '', email: '', phone: '', stringingPoint: '' })} style={{ background: 'transparent', border: 'none', color: '#FECACA', fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                        Limpar Filtros
                      </button>
                    )}
                    <button className="button-primary" style={{ padding: '8px 16px', fontSize: '14px', background: activeCustomerFiltersCount > 0 ? '#6136B3' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '24px', display: 'flex', gap: '6px', alignItems: 'center' }} onClick={() => setIsCustomerSearchModalOpen(true)}>
                      <Search size={16} /> Busca Avançada {activeCustomerFiltersCount > 0 && \`(\${activeCustomerFiltersCount})\`}
                    </button>
                  </div>`;
file = file.replace(oldSearchBar, newSearchBar);

// 4. Modal
const searchModal = `
        {/* Customer Advanced Search Modal */}
        <AnimatePresence>
          {isCustomerSearchModalOpen && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
            }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                style={{ width: '100%', maxWidth: '700px', background: 'var(--bg-panel)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <div style={{ background: '#6136B3', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, margin: 0 }}>Pesquisa Avançada de Clientes</h3>
                  <button onClick={() => setIsCustomerSearchModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
                </div>
                <div style={{ padding: '32px', overflowY: 'auto' }}>
                  <form onSubmit={(e) => { e.preventDefault(); setIsCustomerSearchModalOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Nome</label>
                        <input type="text" value={customerFilters.name} onChange={e => setCustomerFilters({...customerFilters, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }} placeholder="Parte do nome..." />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>ID TechTennis (Múltiplos ou Range)</label>
                        <input type="text" value={customerFilters.numericId} onChange={e => setCustomerFilters({...customerFilters, numericId: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }} placeholder="Ex: 1045, 1046 ou 1045-1050" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Professor / Treinador</label>
                        <select value={customerFilters.professorId} onChange={e => setCustomerFilters({...customerFilters, professorId: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }}>
                          <option value="">Todos</option>
                          {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Clube</label>
                        <select value={customerFilters.originClub} onChange={e => setCustomerFilters({...customerFilters, originClub: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }}>
                          <option value="">Todos</option>
                          {(appSettings.clubs || []).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>E-mail</label>
                        <input type="text" value={customerFilters.email} onChange={e => setCustomerFilters({...customerFilters, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }} placeholder="Email..." />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Celular</label>
                        <input type="text" value={customerFilters.phone} onChange={e => setCustomerFilters({...customerFilters, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }} placeholder="Telefone..." />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
                      <button type="button" onClick={() => setCustomerFilters({ name: '', numericId: '', originClub: '', professorId: '', email: '', phone: '', stringingPoint: '' })} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', color: 'white', cursor: 'pointer' }}>Limpar</button>
                      <button type="submit" className="button-primary" style={{ padding: '12px 24px', borderRadius: '24px' }}>Aplicar Filtros</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>`;

// Insert before the <AnimatePresence> that handles isCustomerModalOpen
// We can find `        {/* Add Customer Modal */}`
file = file.replace('        {/* Add Customer Modal */}', searchModal + '\n\n        {/* Add Customer Modal */}');

fs.writeFileSync('src/components/StringerDashboard.tsx', file);
console.log('Search successfully added');
