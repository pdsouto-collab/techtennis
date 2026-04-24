const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@techtennis.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Administrador Oficial',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'active'
      }
    });
    console.log(`✅ Admin oficial injetado com e-mail: ${adminEmail} | senha: admin123`);
  } else {
    console.log('⚠️ Admin já existe no banco Neon.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
