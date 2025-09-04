import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seeding...');

  // 1. Criar o Cargo de Administrador (se não existir)
  const adminCargo = await prisma.cargos.upsert({
    where: { nome_cargo: 'Administrador' },
    update: {},
    create: {
      nome_cargo: 'Administrador',
    },
  });
  console.log(`Cargo '${adminCargo.nome_cargo}' criado/verificado.`);

  // 2. Criar Permissões essenciais (se não existirem)
  const permissoesData = [
    { descricao: 'gerenciar_usuarios' },
    { descricao: 'gerenciar_empresas' },
    { descricao: 'gerenciar_contratos' },
    { descricao: 'acesso_total' },
  ];

  const permissoesPromises = permissoesData.map((p) =>
    prisma.permissoes.upsert({
      where: { descricao: p.descricao },
      update: {},
      create: { descricao: p.descricao },
    })
  );
  const permissoes = await Promise.all(permissoesPromises);
  console.log('Permissões criadas/verificadas.');

  // 3. Criar o Usuário Administrador (se não existir)
  const adminEmail = 'admin@climbe.com.br';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  const adminUser = await prisma.usuarios.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: 'Administrador do Sistema',
      email: adminEmail,
      cpf: '000.000.000-00', // CPF genérico para o admin
      senha: hashedPassword,
      status: 'approved', // Admin já começa aprovado
      id_cargo: adminCargo.id_cargo, // Associa ao cargo de admin
    },
  });
  console.log(`Usuário Administrador '${adminUser.email}' criado/verificado.`);

  // 4. Vincular todas as permissões ao usuário Administrador
  const usuarioPermissoesData = permissoes.map((p) => ({
    id_usuario: adminUser.id_usuario,
    id_permissao: p.id_permissao,
  }));
  
  // Usamos createMany com skipDuplicates para evitar erros se as permissões já estiverem vinculadas
  await prisma.usuario_permissoes.createMany({
    data: usuarioPermissoesData,
    skipDuplicates: true,
  });
  console.log(`Permissões vinculadas ao usuário ${adminUser.email}.`);

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });