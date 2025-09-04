import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../model/userModel.js';
import { roleModel} from '../model/roleModel.js';
import { sendApprovalEmail, sendRejectionEmail, sendManagerNotification, sendApprovedLogin } from '../mailer.js';

// Cadastro
async function registerUser(userData) {
  const { fullName, email, password, cpf, phone } = userData;

  if (!fullName || !email || !password || !cpf || !phone) {
    throw new Error('O preenchimento de todos os dados é OBRIGATÓRIO!');
  }

  const existingEmail = await userModel.findByEmail(email);
  if (existingEmail) {
    throw new Error('Este e-mail já está em uso.');
  }

  const existingCpf = await userModel.findByCpf(cpf);
  if (existingCpf) {
    throw new Error('Este CPF já está em uso.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await userModel.save({
    fullName,
    email,
    cpf,
    phone,
    password: passwordHash,
  });

  await sendApprovalEmail(email, fullName);
  await sendManagerNotification({ fullName, email });
  return { success: true, message: 'Usuário cadastrado com sucesso. E-mail de análise enviado.' };
}

async function loginUser({ email, senha }) {
  if (!email || !senha) {
    throw new Error('Preencha os campos de email e senha para acessar o sistema.');
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new Error('E-mail inválidos.');
  }
  
  // Agora esta verificação de status vai funcionar
  if (user.status !== 'approved') {
    throw new Error('Seu cadastro ainda não foi aprovado.');
  }

  // CORREÇÃO: Comparando a 'senha' recebida com a 'user.senha' do banco
  const isPasswordMatch = await bcrypt.compare(senha, user.senha);
  if (!isPasswordMatch) {
    throw new Error('Senha inválidos.');
  }
  
  // CORREÇÃO: Usando 'id_usuario' e 'nome' no token JWT
  const token = jwt.sign(
    { id: user.id, name: user.fullName, email: user.email,  cpf: user.cpf, phone: user.phone, roleID: user.roleID },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { 
    success: true, 
    user: { id: user.id, fullName: user.fullName, email: user.email, cpf: user.cpf, phone: user.phone, roleID: user.roleID  },
    token 
  };
}

async function findMany() {
  const ursers = await userModel.findMany();
  if (!ursers || ursers.length === 0) {
    throw new Error('Erro ao buscar usuários ou nenhum usuário encontrado.');
  }
  return await userModel.findMany();
}

async function findById(id) {
  const user = await userModel.findById(id);
  if (!user) throw new Error('Usuário não encontrado.');
  return user;
}

async function findByEmail(email) {
  const user = await userModel.findByEmail(email);
  if (!user) throw new Error('Usuário não encontrado.');
  return user;
}

// Atualização de Status 
async function updateUserStatus(id, status) {
  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Status inválido. Use "approved" ou "rejected".');
  }

  const user = await userModel.findById(id);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }
  
  await userModel.updateStatus(id, status);
  
  // CORREÇÃO: Usando 'user.nome'
  if (status === 'approved') {
    await sendApprovedLogin(user.email, user.fullName);
  } else {
    await sendRejectionEmail(user.email, user.nome);
  }
  
  // CORREÇÃO: Usando 'user.nome'
  return { success: true, message: `Usuário ${user.nome} agora está '${status}'.` };
}

// Dar cargo aos usuários 
export async function assignRoleToUser(userId, roleId) {
  
  const user = await userModel.findById(userId);
  if (!user) throw new Error('Usuário não encontrado.');

  if (user.status !== 'approved') {
    throw new Error('Não é possível atribuir cargo a um usuário não aprovado.');
  }

  const role = await roleModel.findById(roleId);
  if (!role) throw new Error('Cargo não encontrado.');


  await userModel.updateRole(userId, roleId);

  return { success: true, message: `Cargo '${role.name}' atribuído ao usuário ${user.fullName}.` };
}

// Buscar usuários pendentes
async function getPendingUsers() {
    return await userModel.findPending();
}

export const userService = {
  registerUser,
  findById,
  findByEmail,
  findMany,
  loginUser,
  updateUserStatus,
  getPendingUsers,
  assignRoleToUser,
};