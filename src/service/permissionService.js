import { permissionModel } from "../model/permissionModel.js";

async function create(data) {
    if (!data.description) {
        throw new Error('A descrição da permissão é obrigatória.');
    }

    return await permissionModel.save(data);
}

async function findById(id) {
    const permission = await permissionModel.findById(id);
    if (!permission) throw new Error('Permissão não encontrada.');
    return permission;
}

async function findAll() {
    const permissions = await permissionModel.findMany();

    if (permissions.length === 0) {
        throw new Error('Nenhuma permissão encontrada.');
    }

    return permissions;
}

async function update(id, data) {

    const permission = await permissionModel.findById(id);
    if (!permission) throw new Error('Id não encontrado.');

    if (!data) throw new Error('Descrição da permissão é obrigatória.');

    await permissionModel.update(id, data);
    return { success: true, message: `Permissão '${data}' atualizada com sucesso.` };
    
}

async function remove(id) {
    const permission = await permissionModel.findById(id);
    if (!permission) throw new Error('Permissão não encontrada.');
    
    await permissionModel.delete(id);
    return { success: true, message: 'Permissão removida com sucesso.' };
}

export const permissionService = {
    create,
    findById,
    findAll,
    update,
    remove
} 