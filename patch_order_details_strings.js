const fs = require('fs');
const path = './web/src/components/OrderDetailsView.tsx';
let content = fs.readFileSync(path, 'utf8');

// The block to replace:
/*
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '4px' }}>
                    {orderJob.racketModel} 
                    {suffix && <span style={{fontWeight: 600, color: '#888'}}> {suffix}</span>}
                  </div>
                  <div style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>18x20 L3</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Solinco Hyper-G Green</div>
                  <div style={{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>@ {orderJob.tension || '52 lbs'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Solinco Hyper-G Green</div>
                  <div style={{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>@ {orderJob.tension || '52 lbs'}</div>
                </div>
                <div>
                  <div style={{ display: 'inline-block', background: '#F2C94C', color: 'var(--text-dark)', padding: '6px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 800 }}>
                    {orderJob.type === 'to_string' ? 'Para Encordoar' : orderJob.type === 'picking_up' ? 'Pronto' : 'Aguardando'}
                  </div>
                </div>
                <div></div>
                <div></div>
*/

const targetRegex = /<div>\s*<div style=\{\{ fontWeight: 800, fontSize: '16px', marginBottom: '4px' \}\}>\s*\{orderJob\.racketModel\}\s*\{suffix && <span style=\{\{fontWeight: 600, color: '#888'\}\}> \{suffix\}<\/span>\}\s*<\/div>\s*<div style=\{\{ fontSize: '14px', color: '#888', fontWeight: 500 \}\}>18x20 L3<\/div>\s*<\/div>\s*<div>\s*<div style=\{\{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' \}\}>Solinco Hyper-G Green<\/div>\s*<div style=\{\{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 \}\}>@ \{orderJob\.tension \|\| '52 lbs'\}<\/div>\s*<\/div>\s*<div>\s*<div style=\{\{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' \}\}>Solinco Hyper-G Green<\/div>\s*<div style=\{\{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 \}\}>@ \{orderJob\.tension \|\| '52 lbs'\}<\/div>\s*<\/div>\s*<div>\s*<div style=\{\{ display: 'inline-block', background: '#F2C94C', color: 'var\(--text-dark\)', padding: '6px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 800 \}\}>\s*\{orderJob\.type === 'to_string' \? 'Para Encordoar' : orderJob\.type === 'picking_up' \? 'Pronto' : 'Aguardando'\}\s*<\/div>\s*<\/div>\s*<div><\/div>\s*<div><\/div>/;

const replacement = `<div>
                  <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '4px' }}>
                    {orderJob.racketModel} 
                    {suffix && <span style={{fontWeight: 600, color: '#888'}}> {suffix}</span>}
                  </div>
                  <div style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>
                    {(() => {
                      const r = rackets?.find((rk: any) => rk.id === orderJob.racketId);
                      if (!r) return '';
                      return [r.stringPattern, r.gripSize].filter(Boolean).join(' ');
                    })()}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{orderJob.stringMains || orderJob.mainString || 'Não definido'}</div>
                  <div style={{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>@ {orderJob.tensionMain || orderJob.tension || '?'} {orderJob.tensionUnit || 'Lbs'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{orderJob.stringCross || orderJob.crossString || orderJob.stringMains || orderJob.mainString || 'Não definido'}</div>
                  <div style={{ display: 'inline-block', background: '#4298E7', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>@ {orderJob.tensionCross || orderJob.tension || '?'} {orderJob.tensionUnit || 'Lbs'}</div>
                </div>
                <div>
                  <div style={{ display: 'inline-block', background: '#F2C94C', color: 'var(--text-dark)', padding: '6px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 800, textTransform: 'capitalize' }}>
                    {orderJob.status || (orderJob.type === 'to_string' ? 'Para Encordoar' : orderJob.type === 'picking_up' ? 'Pronto' : 'Aguardando')}
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>{orderJob.stringerName || '-'}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{orderJob.updatedAt ? new Date(orderJob.updatedAt).toLocaleDateString('pt-BR') : '-'}</div>`;

content = content.replace(targetRegex, replacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Order Details Strings Patched Successfully');
