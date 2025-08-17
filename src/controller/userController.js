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
        const { id } = req.params;
        const { status } = req.body;
        const result = await userService.updateUserStatus(id, status);
        return res.status(200).json(result);
    } catch (error) {
        // Erros podem ser por dados inválidos (400) ou usuário não encontrado (404)
        const statusCode = error.message.includes('encontrado') ? 404 : 400;
        return res.status(statusCode).json({ error: error.message });
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