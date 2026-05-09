const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function test() {
  const settings = await prisma.settings.findMany({ where: { key: { in: ['bankCode', 'bankAccount', 'bankAccountName'] } } });
  console.log("Settings:", settings);
  const p = await prisma.payment_methods.findMany();
  console.log("Payments:", p);
  await prisma.$disconnect();
}
test();
