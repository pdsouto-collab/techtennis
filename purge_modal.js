const fs = require('fs');
const file = 'web/src/components/StringerDashboard.tsx';
const oldFormTxt = fs.readFileSync('old_form.txt', 'utf8').trim();

let c = fs.readFileSync(file, 'utf8');

const replacementForm = `                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => { 
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
                     }).then(async (res) => {
                       if (!res.ok) {
                         const data = await res.json().catch(() => ({}));
                         alert(data.error || 'Erro ao salvar a raquete.');
                       } else {
                         await fetchRackets();
                         setIsRacketModalOpen(false);
                       }
                     });
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
                     });
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
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Padrão de cordas</label>
                      <input name="stringPattern" type="text" style={inputStyle} defaultValue={racketFormDefault?.stringPattern || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Tamanho do Grip</label>
                      <input name="gripSize" type="text" style={inputStyle} defaultValue={racketFormDefault?.gripSize || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Esporte</label>
                      <select name="sport" style={inputStyle} defaultValue={racketFormDefault?.sport || 'Tênis'}>
                         {(appSettings.sports || ['Tênis', 'Beach Tennis', 'Squash', 'Badminton', 'Padel']).map((s: string) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Observações</label>
                    <textarea name="notes" rows={3} style={{ ...inputStyle, resize: 'none' }} defaultValue={racketFormDefault?.notes || ''}></textarea>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Peso (g)</label>
                      <input name="weight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.weight || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Equilíbrio (mm)</label>
                      <input name="balance" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.balance || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Comprimento (mm)</label>
                      <input name="length" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.length || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Swingweight (kgcm²)</label>
                      <input name="swingweight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.swingweight || ''} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Spinweight (kgcm²)</label>
                      <input name="spinweight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.spinweight || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Twistweight (kgcm²)</label>
                      <input name="twistweight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.twistweight || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Recoilweight (kgcm²)</label>
                      <input name="recoilweight" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.recoilweight || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Índice Polar</label>
                      <input name="polarIndex" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.polarIndex || ''} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez (RA)</label>
                      <input name="stiffnessRA" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.stiffnessRA || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez Dinâmica (Hz)</label>
                      <input name="dynamicStiffnessHz" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.dynamicStiffnessHz || ''} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rigidez Dinâmica (DRA)</label>
                      <input name="dynamicStiffnessDRA" type="number" step="0.1" style={inputStyle} defaultValue={racketFormDefault?.dynamicStiffnessDRA || ''} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                    <button type="button" onClick={() => setIsRacketModalOpen(false)} style={{ padding: '16px 32px', background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '100px', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Fechar</button>
                    <button type="submit" className="button-primary" style={{ padding: '16px 32px' }}>Salvar Alterações</button>
                  </div>

                </form>`;

// Find exact block inside StringerDashboard and replace
const startIndex = c.indexOf('<form style={{ display: \'flex\', flexDirection: \'column\', gap: \'20px\' }}');
if(startIndex !== -1) {
  // Use string replace based on oldFormTxt match
  // Some whitespace might be tricky, so we replace from the start of the <form> to the end of the `</form>` for the duplicate modal part.
  const endFormStr = '</form>';
  let endIndex = c.indexOf(endFormStr, startIndex) + endFormStr.length;
  // wait, because we have a nested/duplicate form, let's find the closing form of the *second* duplicate.
  let secondEndIndex = c.indexOf(endFormStr, endIndex) + endFormStr.length;
  
  if(secondEndIndex > endIndex && (secondEndIndex - startIndex) < 30000) {
    // we found a duplicate
    const chunk = c.substring(startIndex, secondEndIndex);
    // double check it's our target
    c = c.substring(0, startIndex) + replacementForm + c.substring(secondEndIndex);
    fs.writeFileSync(file, c);
    console.log("Success! File replaced!");
  }
}
