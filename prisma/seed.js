import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🏁  Iniciando o script de seed...');

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

  console.log(`📝  Carregados ${roles.length} cargos para inserir.`);

  for (const role of roles) {
    const result = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    console.log(`✅  Cargo processado: ${result.name}`);
  }

  console.log('🎉  Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('💥  Ocorreu um erro inesperado no script de seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🔌  Desconectando o Prisma Client...');
    await prisma.$disconnect();
  });