const fs = require('fs');
let orders = fs.readFileSync('src/components/OrdersView.tsx', 'utf8');
orders = orders.replace('ID do Cliente', 'ID TechTennis');
orders = orders.replace('ID do Cliente', 'ID TechTennis');
fs.writeFileSync('src/components/OrdersView.tsx', orders);
console.log('Fixed OrdersView');
