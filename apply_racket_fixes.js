const fs = require('fs');
let c = fs.readFileSync('web/src/components/StringerDashboard.tsx', 'utf8');

// 1. Remove the "Buscar Cliente" button since the input works directly, to stop confusion.
// And change the button to something else? No, just removing `<Search size={18} /> Buscar Cliente`
// It's on a button block. Let's find it.
c = c.replace(/<button type="button" onClick=\{[^}]+\}\s*style=\{\{[^}]+\}\}>\s*<Search size=\{18\} \/> Buscar Cliente\s*<\/button>/g, '');

// 2. Change "Observações (Notes)" to "Observações (Notas)"
c = c.replace(/ObservaA Aes \(Notes\)/g, 'Observações (Notas)');

// 3. Fix Clone Racket to pull 100% of fields except identifier (and id)
c = c.replace(
  /setRacketFormDefault\(\{ name: racket\.name \+ ' \[CA3pia\]', isClone: true \}\);/g,
  `setRacketFormDefault({ ...racket, name: racket.name, identifier: '', isClone: true });`
);

// 4. Update racket creation modal submission to include all 16 fields
c = c.replace(
  /const racketData = \{\n([\s\S]*?)brand: fd\.get\('brand'\) as string\n\s*\};/,
  `const racketData = {
                          customerId: selectedCustomer?.id || '',
                          name: racketName,
                          brand: fd.get('brand') as string,
                          identifier: fd.get('identifier') as string,
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
                        };`
);

// 5. Update racket display format `racket.name + (racket.identifier ? ' [' + racket.identifier + ']' : '')`
// In the dropdown <option value={r.name}>{r.name}</option> 
c = c.replace(
  /<option key=\{r\.id\} value=\{r\.name\}>\n\s*\{r\.name\} \(JA na ordem\)\n\s*<\/option>\n\s*:\n\s*<option key=\{r\.id\} value=\{r\.name\}>\n\s*\{r\.name\}\n\s*<\/option>/g,
  `<option key={r.id} value={r.name + (r.identifier ? ' [' + r.identifier + ']' : '')}>
                              {r.name + (r.identifier ? ' [' + r.identifier + ']' : '')} (Já na ordem)
                           </option>
                           :
                           <option key={r.id} value={r.name + (r.identifier ? ' [' + r.identifier + ']' : '')}>
                              {r.name + (r.identifier ? ' [' + r.identifier + ']' : '')}
                           </option>`
);

// Also replace anywhere a racket's name is just displayed `{racket.name}`
// I can just map `const getRacketDisplayName = (r) => r.name + (r.identifier ? ' [' + r.identifier + ']' : '');`
// Inside the component... I'll inject the helper near top of StringerDashboard:
c = c.replace(
  /export default function StringerDashboard\(\) \{/,
  `export default function StringerDashboard() {\n  const getRacketDisplayName = (r: any) => r ? (r.name + (r.identifier ? ' [' + r.identifier + ']' : '')) : '';`
);

// Replace `{racket.name}` with `{getRacketDisplayName(racket)}` in the racket tables
c = c.replace(/\{racket\.name\}/g, '{getRacketDisplayName(racket)}');
// Note: this also hits other things, let's just make it replace cleanly
c = c.replace(/\{r\.name\}/g, '{getRacketDisplayName(r)}');

// Fix racket data read
c = c.replace(
  /const racketName = fd\.get\('racketName'\) as string;/,
  `const racketName = fd.get('racketName') as string;
   const identifier = fd.get('identifier') as string;`
);

fs.writeFileSync('web/src/components/StringerDashboard.tsx', c);
