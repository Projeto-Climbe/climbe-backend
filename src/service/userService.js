import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../model/userModel.js';
import { roleModel} from '../model/roleModel.js';
import { sendApprovalEmail, sendRejectionEmail, sendManagerNotification, sendApprovedLogin } from '../mailer.js';
import crypto from 'crypto';
import { sendTemporaryPasswordEmail } from '../mailer.js';
import prisma from '../utils/prismaClient.js';

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

  try {
    await sendApprovalEmail(email, fullName);
    await sendManagerNotification({ fullName, email });
  } catch (error) {
    throw new Error('Falha ao validar ou enviar e-mail: ' + error.message);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await userModel.save({
    fullName,
    email,
    cpf,
    phone,
    password: passwordHash
  });

  return { success: true, message: 'Usuário cadastrado com sucesso. E-mail de análise enviado.' };
}


async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Preencha os campos de email e senha para acessar o sistema.');
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new Error('E-mail inválidos.');
  }
  
  if (user.status !== 'approved') {
    throw new Error('Seu cadastro ainda não foi aprovado.');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Senha inválidos.');
  }
  
  const token = jwt.sign(
    { id: user.id, name: user.fullName, email: user.email,  cpf: user.cpf, phone: user.phone, roleID: user.roleID },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { 
    success: true, 
    user: token 
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
  
  if (status === 'approved') {
    await sendApprovedLogin(user.email, user.fullName);
  } else {
    await sendRejectionEmail(user.email, user.fullName);
  }
  
  return { success: true, message: `Usuário ${user.fullName} agora está '${status}'.` };
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

async function remove(id) {
    const permission = await userModel.findById(id);
    if (!permission) throw new Error('Permissão não encontrada.');
    
    await userModel.delete(id);
    return { success: true, message: 'Permissão removida com sucesso.' };
}


// Solicitar redefinição de senha
async function requestPasswordReset(email) {
  const user = await userModel.findByEmail(email);
  if (!user) return; // Não revela se o e-mail existe
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos
  await prisma.passwordResetToken.upsert({
    where: { userId: user.id },
    update: { token, expiresAt: expires },
    create: { userId: user.id, token, expiresAt: expires },
  });
  await sendTemporaryPasswordEmail(user.email, user.fullName || user.email, token);
}

// Redefinir senha com token
async function resetPassword(token, newPassword) {
  const reset = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!reset || reset.expiresAt < new Date()) throw new Error('Token inválido ou expirado.');
  const user = await userModel.findById(reset.userId);
  if (!user) throw new Error('Usuário não encontrado.');
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await userModel.update(user.id, { password: passwordHash });
  await prisma.passwordResetToken.delete({ where: { token } });
}

// Trocar senha autenticado
async function changePassword(userId, currentPassword, newPassword) {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('Usuário não encontrado.');
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('Senha atual incorreta.');
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await userModel.update(userId, { password: passwordHash });
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
  remove,
  requestPasswordReset,
  resetPassword,
  changePassword
};