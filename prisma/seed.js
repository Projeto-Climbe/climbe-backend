const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cargos padrões
  const roles = [
    { name: 'Compliance' },
    { name: 'CEO' },
    { name: 'Membro do Conselho' },
    { name: 'CSO' },
    { name: 'CMO' },
    { name: 'CFO' },
    { name: 'Analista de Valores Imobiliários - Trainee' },
    { name: 'Analista de Valores Imobiliários - Júnior' },
    { name: 'Analista de Valores Imobiliários - Pleno' },
    { name: 'Analista de Valores Imobiliários - Sênior' },
    { name: 'Analista de BPO Financeiro' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
