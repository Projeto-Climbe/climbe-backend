import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../model/userModel.js';
import { sendApprovalEmail, sendRejectionEmail } from '../mailer.js';

// Cadastro
async function registerUser(userData) {
  const { nome, email, senha, cpf } = userData;

  if (!nome || !email || !senha || !cpf) {
    throw new Error('O preenchimento de todos os dados é obrigatório!');
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new Error('Este e-mail já está em uso.');
  }

  const passwordHash = await bcrypt.hash(senha, 10);

  await userModel.create({
    nome,
    email,
    cpf,
    senha: passwordHash,
    id_cargo: 2,
  });

  await sendApprovalEmail(email, nome);
  return { success: true, message: 'Usuário cadastrado com sucesso. E-mail de análise enviado.' };
}

async function loginUser({ email, senha }) {
  if (!email || !senha) {
    throw new Error('Preencha os campos de email e senha para acessar o sistema.');
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new Error('E-mail ou senha inválidos.');
  }
  
  // Agora esta verificação de status vai funcionar
  if (user.status !== 'approved') {
    throw new Error('Seu cadastro ainda não foi aprovado.');
  }

  // CORREÇÃO: Comparando a 'senha' recebida com a 'user.senha' do banco
  const isPasswordMatch = await bcrypt.compare(senha, user.senha);
  if (!isPasswordMatch) {
    throw new Error('E-mail ou senha inválidos.');
  }
  
  // CORREÇÃO: Usando 'id_usuario' e 'nome' no token JWT
  const token = jwt.sign(
    { id: user.id_usuario, name: user.nome, email: user.email, permissao: user.id_cargo },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { 
    success: true, 
    // CORREÇÃO: Retornando o objeto de usuário com os nomes corretos
    user: { id: user.id_usuario, fullName: user.nome, email: user.email },
    token 
  };
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
    await sendApprovalEmail(user.email, user.nome);
  } else {
    await sendRejectionEmail(user.email, user.nome);
  }
  
  // CORREÇÃO: Usando 'user.nome'
  return { success: true, message: `Usuário ${user.nome} agora está '${status}'.` };
}

// Buscar usuários pendentes
async function getPendingUsers() {
    return await userModel.findPending();
}

export const userService = {
  registerUser,
  loginUser,
  updateUserStatus,
  getPendingUsers,
};