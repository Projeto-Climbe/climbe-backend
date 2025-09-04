import { userModel } from '../model/userModel.js';
import { permissionModel } from '../model/permissionModel.js';
import { userPermissionModel } from '../model/userPermissionModel.js';

async function create(data) {
    const { userId, permissionId } = data;

    if (!userId || !permissionId) {
        throw new Error('O preenchimento de todos os dados é OBRIGATÓRIO!');
    }

    const user = await userModel.findById(userId);
    if (!user) throw new Error('Usuário não encontrado.');

    const permission = await permissionModel.findById(permissionId);
    if (!permission) throw new Error('Permissão não encontrada.');

    const existing = await userPermissionModel.findUserPermissions(userId, permissionId);
    if (existing.length > 0) {
        throw new Error('Este usuário já possui essa permissão.');
    }

    return await userPermissionModel.save(data);
}

async function findById(id) {
    const userPermission = await userPermissionModel.findById(id);
    if (!userPermission) throw new Error('Permissão de Usário não encontrada.');
    return userPermission;
}

async function findAll() {
    const userPermission = await userPermissionModel.findMany();

    if (userPermission.length === 0) {
        throw new Error('Nenhuma permissão de usuário encontrada.');
    }

    return userPermission;
}

async function update(id, userId, permissionId) {
    const userPermission = await userPermissionModel.findById(id);
    if (!userPermission) throw new Error('Id não encontrado.');
    await userPermissionModel.update(id, userId, permissionId);
    return { success: true, message: `Permissão de usuário atualizada com sucesso.` };
}


export const userPermissionService = {
    create,
    findById,
    findAll,
    update,
} 