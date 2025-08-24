import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../model/userModel.js';
import { sendApprovalEmail, sendRejectionEmail, sendManagerNotification, sendApprovedLogin } from '../mailer.js';

// Cadastro 
async function registerUser(userData) {
  const { fullName, email, password } = userData;

  if (!fullName || !email || !password) {
    throw new Error('O preenchimento de todos os dados é obrigatório!');
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new Error('Este e-mail já está em uso.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await userModel.create({
    fullName,
    email,
    password: passwordHash,
  });

  await sendApprovalEmail(email, fullName);
  await sendManagerNotification({ fullName, email });
  return { success: true, message: 'Usuário cadastrado com sucesso. E-mail de análise enviado.' };
}

// Login 
async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Preencha os campos de email e senha para acessar o sistema.');
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new Error('E-mail ou senha inválidos.');
  }
  
  if (user.status !== 'approved') {
    throw new Error('Seu cadastro ainda não foi aprovado.');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('E-mail ou senha inválidos.');
  }

  const token = jwt.sign(
    { id: user.id, name: user.fullName, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { 
    success: true, 
    user: { id: user.id, fullName: user.fullName, email: user.email },
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

  if (status === 'approved') {
    await sendApprovedLogin(user.email, user.fullName);
  } else {
    await sendRejectionEmail(user.email, user.fullName);
  }
  
  return { success: true, message: `Usuário ${user.fullName} agora está '${status}'.` };
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