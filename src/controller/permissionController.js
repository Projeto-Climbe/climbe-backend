import {permissionService} from '../service/permissionService.js';

export async function create(req, res) {
    try { 
        const permission = await permissionService.create(req.body);
        res.status(201).json(permission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function findAll(req, res) {
    try {
        const permissions = await permissionService.findAll();
        res.json({ permissions });
    } catch (error) {
        const status = error.message.includes('Nenhuma permissão encontrada') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
}
export async function findById(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error('ID inválido.');
        const permission = await permissionService.findById(id);
        res.json({ permission });
    } catch (error) {
        const status = error.message.includes('Não encontrado') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
}

export async function update(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) throw new Error('ID inválido.');

        const { description } = req.body;

        const result = await permissionService.update(id, description);
        res.json(result);
    }
    catch (error) {
        const status = error.message.includes('Não encontrado') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
}    