import { userService } from '../service/userService.js';

// /signup 
export async function signup(req, res) {
  try {
    const result = await userService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// /login
export async function login(req, res) {
  try {
    const result = await userService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    // Erros de login podem ser de "não autorizado" (401) ou "proibido" (403)
    const statusCode = error.message.includes('aprovado') ? 403 : 401;
    return res.status(statusCode).json({ error: error.message });
  }
}

//  /users/:id/status 
export async function updateUserStatus(req, res) {
  try {
    const id = parseInt(req.params.id); 
    if (isNaN(id)) throw new Error('ID inválido.');

    const { status } = req.body; 
    const result = await userService.updateUserStatus(id, status);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


export async function assignRoleToUser(req, res) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) throw new Error('ID de usuário inválido.');

    const { role_id } = req.body;
    if (!role_id || isNaN(role_id)) throw new Error('ID de cargo inválido.');

    const result = await userService.assignRoleToUser(userId, role_id);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

// /pending
export async function getPendingUsers(req, res) {
    try {
        const users = await userService.getPendingUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários pendentes.' });
    }
}