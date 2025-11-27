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

  const permissions = [
  'Visualização, criação, edição e exclusão de Contratos',
  'Visualização, criação, edição e exclusão de cargos',
  'Visualização, criação, edição e exclusão de documentos jurídicos',
  'Aplicação de nível de complexidade de contratos',
  'Edição restrita da planilha com necessidade de solicitar permissão',
  'Agendamento de Reuniões',
  'Visualização, criação, edição e exclusão de relatórios',
  'Upload de arquivos',
  'Download de arquivos',
  ];

  const service = [

    'Contabilidade',
    'Avaliações de Empresas (Valuation)',
    'Terceirização de Rotinas Financeiras (BPO)',
    'Diretoria Financeira Sob Demanda (CFO)',
    'Fusões & Aquisições (M&A)'
  ]

  console.log(`📝  Carregados ${roles.length} cargos para inserir.`);
  console.log(`📝  Carregadas ${permissions.length} permissões para inserir.`);
  console.log(`📝  Carregados ${service.length} serviços para inserir.`);

  for (const servico of service) {
    const result = await prisma.service.upsert({
      where: { name: servico },
      update: {},
      create: { name: servico },
    });
    console.log(`✅  Serviço processado: ${result.name}`);
  }

  for (const permission of permissions) {
    const result = await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: { name: permission },
    });
    console.log(`✅  Permissão processada: ${result.name}`);
  }

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