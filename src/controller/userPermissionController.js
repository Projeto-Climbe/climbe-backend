import { userPermissionService } from "../service/userPermissionService.js";

export async function create(req, res) {
    try { 
        const userPermission = await userPermissionService.create(req.body);
        res.status(201).json(userPermission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function findAll(req, res) {
    try {
        const userPermission = await userPermissionService.findAll();
        res.json({ userPermission });
    } catch (error) {
        const status = error.message.includes('Nenhuma permissão de usuário encontrada') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
}
export async function findById(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error('ID inválido.');
        const userPermission = await userPermissionService.findById(id);
        res.json({ userPermission });
    } catch (error) {
        const status = error.message.includes('Não encontrado') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
}

export async function update(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error('ID inválido.');

        const { userId, permissionId } = req.body;
        const result = await userPermissionService.update(id, userId, permissionId);
        res.json(result);
    }
    catch (error) {
        const status = error.message.includes('Não encontrado') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }   
}

export async function remove(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error('ID inválido.');
        
        await userPermissionService.remove(id);
        res.status(204).send();
    } catch (error) {
        const status = error.message.includes('Não encontrado') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
}