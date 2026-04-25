const fs = require('fs');

const file = 'web/src/components/StringerDashboard.tsx';
let c = fs.readFileSync(file, 'utf8');

const startMarker = `<form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => {`;
const startIndex = c.indexOf(startMarker, c.indexOf("isRacketModalOpen"));
if (startIndex === -1) {
  console.log("Could not find start");
  process.exit(1);
}

// Find the corresponding `</form>` using substring
function findClosingForm(str, startIndex) {
   return str.indexOf('</form>', startIndex) + '</form>'.length;
}

const endIndex = findClosingForm(c, startIndex);

const newForm = `<form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => { 
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
                      alert('Não é possível salvar: o cliente já possui uma raquete com este mesmo Nome e Identificador!');
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
                       }).then(() => fetchRackets());
                    } else {
                       fetch(\`\$\{API_URL\}/api/rackets\`, {
                         method: 'POST',
                         headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
                         body: JSON.stringify({ ...payload, customerId })
                       }).then(() => fetchRackets());
                    }
                    setIsRacketModalOpen(false); 
                  }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Raquete</label>
                        <input name="racketName" type="text" required defaultValue={racketFormDefault?.name || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Marca da Raquete</label>
                        <input name="brand" type="text" defaultValue={racketFormDefault?.brand || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Identificador</label>
                        <input name="identifier" type="text" defaultValue={racketFormDefault?.identifier || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Padrão de cordas</label>
                        <input name="stringPattern" type="text" defaultValue={racketFormDefault?.stringPattern || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tamanho do Grip</label>
                        <input name="gripSize" type="text" defaultValue={racketFormDefault?.gripSize || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Esporte</label>
                        <select name="sport" defaultValue={racketFormDefault?.sport || 'Tênis'} style={inputStyle}>
                          <option value="Tênis">Tênis</option>
                          <option value="Beach Tennis">Beach Tennis</option>
                          <option value="Squash">Squash</option>
                          <option value="Badminton">Badminton</option>
                          <option value="Padel">Padel</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações</label>
                        <textarea name="notes" rows={2} defaultValue={racketFormDefault?.notes || ''} style={{...inputStyle, resize: 'none'}} />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Peso (g)</label>
                        <input name="weight" type="number" step="0.1" defaultValue={racketFormDefault?.weight || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Equilíbrio (mm)</label>
                        <input name="balance" type="number" step="0.1" defaultValue={racketFormDefault?.balance || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Comprimento (mm)</label>
                        <input name="length" type="number" step="0.1" defaultValue={racketFormDefault?.length || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Swingweight (kgcm²)</label>
                        <input name="swingweight" type="number" step="0.1" defaultValue={racketFormDefault?.swingweight || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Spinweight (kgcm²)</label>
                        <input name="spinweight" type="number" step="0.1" defaultValue={racketFormDefault?.spinweight || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Twistweight (kgcm²)</label>
                        <input name="twistweight" type="number" step="0.1" defaultValue={racketFormDefault?.twistweight || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Recoilweight (kgcm²)</label>
                        <input name="recoilweight" type="number" step="0.1" defaultValue={racketFormDefault?.recoilweight || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Índice Polar</label>
                        <input name="polarIndex" type="number" step="0.1" defaultValue={racketFormDefault?.polarIndex || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez (RA)</label>
                        <input name="stiffnessRA" type="number" step="0.1" defaultValue={racketFormDefault?.stiffnessRA || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez Dinâmica (Hz)</label>
                        <input name="dynamicStiffnessHz" type="number" step="0.1" defaultValue={racketFormDefault?.dynamicStiffnessHz || ''} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez Dinâmica (DRA)</label>
                        <input name="dynamicStiffnessDRA" type="number" step="0.1" defaultValue={racketFormDefault?.dynamicStiffnessDRA || ''} style={inputStyle} />
                      </div>
                    </div>
  
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                      <button type="button" onClick={() => setIsRacketModalOpen(false)} style={{ padding: '16px 32px', background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Fechar</button>
                      <button type="submit" className="button-primary" style={{ padding: '16px 32px' }}>Salvar Alterações</button>
                    </div>
                  </form>`;

c = c.substring(0, startIndex) + newForm + c.substring(endIndex);
fs.writeFileSync(file, c);
console.log("Replaced form successfully");
