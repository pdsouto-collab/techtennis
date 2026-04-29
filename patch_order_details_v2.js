const fs = require('fs');
const path = './web/src/components/OrderDetailsView.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace "Test" with actual stringingPoint
content = content.replace(
  '<div style={{ fontWeight: 800, fontSize: \'18px\' }}>Test</div>',
  '<div style={{ fontWeight: 800, fontSize: \'18px\' }}>{activeOrderJob.stringingPoint || activeCustomer?.stringingPoint || \'Não definido\'}</div>'
);

// Add isSameOrder helper
if (!content.includes('const isSameOrder =')) {
  content = content.replace(
    'const [pickupNotes, setPickupNotes] = useState(activeOrderJob?.pickupNotes || \'\');',
    `const [pickupNotes, setPickupNotes] = useState(activeOrderJob?.pickupNotes || '');\n  const isSameOrder = (j: any) => activeOrderJob.orderCode ? j.orderCode === activeOrderJob.orderCode : j.id === activeOrderJob.id;`
  );
}

// Replace jobs.filter((j: any) => j.customerName === activeOrderJob.customerName)
content = content.replace(/jobs\.filter\(\(j:\s*any\) => j\.customerName === activeOrderJob\.customerName\)/g, 'jobs.filter(isSameOrder)');

// Replace orderJobs filter
content = content.replace(/jobs\.filter\(\(j:\s*any\) => j\.customerName === activeOrderJob\.customerName\)/g, 'jobs.filter(isSameOrder)');

// Replace in setJobs for "Marcar como pago"
content = content.replace(/jobs\.map\(\(j:\s*any\) => j\.customerName === activeOrderJob\.customerName \?/g, 'jobs.map((j:any) => isSameOrder(j) ?');
content = content.replace(/for\s*\(let j of jobs\)\s*\{\s*if\(j\.customerName === activeOrderJob\.customerName && !j\.paid\)\s*\{/g, 'for (let j of jobs) { if(isSameOrder(j) && !j.paid) {');
content = content.replace(/for\s*\(let j of jobs\)\s*\{\s*if\(j\.customerName === activeOrderJob\.customerName && j\.paid\)\s*\{/g, 'for (let j of jobs) { if(isSameOrder(j) && j.paid) {');

// Replace in setJobs for "Salvar alterações" (pickupDate)
content = content.replace(/jobs\.map\(\(j:\s*any\) => j\.customerName === activeOrderJob\.customerName \?/g, 'jobs.map((j: any) => isSameOrder(j) ?');
content = content.replace(/for\s*\(let j of jobs\)\s*\{\s*if\(j\.customerName === activeOrderJob\.customerName\)\s*\{/g, 'for (let j of jobs) { if(isSameOrder(j)) {');

fs.writeFileSync(path, content, 'utf8');
console.log('OrderDetails patched successfully v2');
