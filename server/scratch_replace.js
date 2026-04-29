const fs = require('fs');
const file = 'd:/kientt.nemark/kinhmatmercy/server/src/routes/admin.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace prisma queries
code = code.replace(/status: \{ not: 'cancelled' \}/g, "status: { in: ['confirmed', 'shipping', 'delivered'] }");

// Replace JS filters
code = code.replace(/o\.status !== 'cancelled'/g, "['confirmed', 'shipping', 'delivered'].includes(o.status)");

fs.writeFileSync(file, code);
console.log('Replaced successfully');
