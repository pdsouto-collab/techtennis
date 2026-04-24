require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function promote() {
  const email = 'pdsouto@gmail.com';
  console.log(`Buscando usuário ${email}...`);
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    await prisma.user.update({
      where: { email },
      data: {
        role: 'ADMIN',
        status: 'active'
      }
    });
    console.log(`✅ SUCESSO! O usuário ${email} foi promovido para ADMIN MÁXIMO e ativado!`);
  } else {
    console.log(`❌ ERRO: Usuário ${email} não encontrado no banco.`);
  }
}

promote()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
