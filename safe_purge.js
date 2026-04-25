const fs = require('fs');
const file = 'web/src/components/StringerDashboard.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetFormStart = `<form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => { 
                  e.preventDefault(); 
                  const fd = new FormData(e.currentTarget);`;

const targetFormEnd = `                </form>`;

const replacementForm = `<form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => { 
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const racketName = fd.get('racketName') as string;
                  const identifier = fd.get('identifier') as string;
                  const brand = fd.get('brand') as string;
                  const customerId = selectedCustomer?.id || '';

                  const isDuplicate = rackets.some(r => 
                    r.customerId === customerId &&
                    r.name.trim().toLowerCase() === racketName.trim().toLowerCase() &&
                    (r.identifier || '').trim().toLowerCase() === (identifier || '').trim().toLowerCase() &&
                    (!racketFormDefault || r.id !== racketFormDefault.id || racketFormDefault.isClone)
                  );

                  if (isDuplicate) {
                    alert('NÃ£o Ã© possÃvel salvar: o cliente jÃ¡ possui uma raquete com este mesmo Nome e Identificador!');
                    return; // Prevent saving
                  }

                  const payload = { 
                    brand, 
                    name: racketName, 
                    identifier,
                    stringPattern: fd.get('stringPattern') as string,
                    gripSize: fd.get('gripSize') as string,
                    sport: fd.get('sport') as string,
                    notes: fd.get('notes') as string,
                    weight: fd.get('weight') as string,
                    balance: fd.get('balance') as string,
                    length: fd.get('length') as string,
                    swingweight: fd.get('swingweight') as string,
                    spinweight: fd.get('spinweight') as string,
                    twistweight: fd.get('twistweight') as string,
                    recoilweight: fd.get('recoilweight') as string,
                    polarIndex: fd.get('polarIndex') as string,
                    stiffnessRA: fd.get('stiffnessRA') as string,
                    dynamicStiffnessHz: fd.get('dynamicStiffnessHz') as string,
                    dynamicStiffnessDRA: fd.get('dynamicStiffnessDRA') as string
                  };
                  
                  if (racketFormDefault && racketFormDefault.id && !racketFormDefault.isClone) {
                     fetch(\`\$\{API_URL\}/api/rackets/\$\{racketFormDefault.id\}\`, {
                       method: 'PUT',
                       headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                       body: JSON.stringify(payload)
                     }).then(async (res) => {
                       if (!res.ok) {
                         const data = await res.json().catch(() => ({}));
                         alert(data.error || 'Erro ao salvar a raquete.');
                       } else {
                         await fetchRackets();
                         setIsRacketModalOpen(false);
                       }
                     }).catch(() => alert('Erro de rede ao salvar raquete.'));
                  } else {
                     fetch(\`\$\{API_URL\}/api/rackets\`, {
                       method: 'POST',
                       headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                       body: JSON.stringify({ ...payload, customerId })
                     }).then(async (res) => {
                       if (!res.ok) {
                         const data = await res.json().catch(() => ({}));
                         alert(data.error || 'Erro ao criar a raquete.');
                       } else {
                         await fetchRackets();
                         setIsRacketModalOpen(false);
                       }
                     }).catch(() => alert('Erro de rede ao criar raquete.'));
                  }
                }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Raquete</label>
                      <input name="racketName" type="text" placeholder="Nome da Raquete" required style={inputStyle} defaultValue={racketFormDefault?.name || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Marca da Raquete</label>
                      <input name="brand" type="text" placeholder="Ex: Wilson" style={inputStyle} defaultValue={racketFormDefault?.brand || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Identificador</label>
                      <input name="identifier" type="text" style={inputStyle} defaultValue={racketFormDefault?.identifier || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>PadrÃ£o de cordas</label>
                      <input name="stringPattern" type="text" style={inputStyle} defaultValue={racketFormDefault?.stringPattern || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tamanho do Grip</label>
                      <input name="gripSize" type="text" style={inputStyle} defaultValue={racketFormDefault?.gripSize || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Esporte</label>
                      <select name="sport" style={inputStyle} defaultValue={racketFormDefault?.sport || 'TÃªnis'}>
                         {(appSettings.sports || ['TÃªnis', 'Beach Tennis', 'Squash', 'Badminton', 'Padel']).map((s: string) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>ObservaÃ§Ãµes</label>
                    <textarea name="notes" rows={3} style={{ ...inputStyle, resize: 'none' }} defaultValue={racketFormDefault?.notes || ''}></textarea>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Peso (g)</label>
                      <input name="weight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.weight || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>EquilÃ­brio (mm)</label>
                      <input name="balance" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.balance || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Comprimento (mm)</label>
                      <input name="length" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.length || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Swingweight (kgcmÂ²)</label>
                      <input name="swingweight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.swingweight || ''} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Spinweight (kgcmÂ²)</label>
                      <input name="spinweight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.spinweight || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Twistweight (kgcmÂ²)</label>
                      <input name="twistweight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.twistweight || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Recoilweight (kgcmÂ²)</label>
                      <input name="recoilweight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.recoilweight || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Ãndice Polar</label>
                      <input name="polarIndex" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.polarIndex || ''} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez (RA)</label>
                      <input name="stiffnessRA" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.stiffnessRA || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez DinÃ¢mica (Hz)</label>
                      <input name="dynamicStiffnessHz" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.dynamicStiffnessHz || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez DinÃ¢mica (DRA)</label>
                      <input name="dynamicStiffnessDRA" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.dynamicStiffnessDRA || ''} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                    <button type="button" onClick={() => setIsRacketModalOpen(false)} style={{ padding: '16px 32px', background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Fechar</button>
                    <button type="submit" className="button-primary" style={{ padding: '16px 32px' }}>Salvar AlteraÃ§Ãµes</button>
                  </div>

                </form>`;

// Find the index of the racket modal form
const i1 = c.indexOf('{isRacketModalOpen && (');
if(i1 !== -1){
    const formStart = c.indexOf(targetFormStart.substring(0, 50), i1);
    if(formStart !== -1){
         const i2 = c.indexOf(targetFormEnd, formStart);
         if(i2 !== -1){
             const newFileContent = c.substring(0, formStart) + replacementForm + c.substring(i2 + targetFormEnd.length);
             fs.writeFileSync(file, newFileContent);
             console.log("Safe replace successful!");
         } else { console.log('Could not find form end limit'); }
    } else { console.log('Could not find form start limit'); }
} else { console.log('Could not find isRacketModalOpen'); }
