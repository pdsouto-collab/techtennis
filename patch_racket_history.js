const fs = require('fs');
const path = './web/src/components/StringerDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace history filters
content = content.replace(
  /jobs\.filter\(j => j\.racketId === activeStringingJob\.racketId && \(j\.status === 'finished' \|\| j\.type === 'ready' \|\| j\.type === 'picked_up'\)\)/g,
  'jobs.filter(j => j.racketId === activeStringingJob.racketId)'
);

content = content.replace(
  /jobs\.filter\(j => j\.racketId === racket\.id && \(j\.status === 'finished' \|\| j\.type === 'ready' \|\| j\.type === 'picked_up'\)\)/g,
  'jobs.filter(j => j.racketId === racket.id)'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Racket history patched successfully');
