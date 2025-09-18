import { roleModel } from "../model/roleModel.js";

async function create(data) {
  if (!data) {
    throw new Error('O nome do cargo é obrigatório.');
  }
    return await roleModel.save(data);
}

async function findAll() {
    const roles = await roleModel.findMany();

    if (roles.length === 0) {
        throw new Error('Nenhum cargo encontrado.');
    }

    return roles;
}

async function findById(id) {
    const role = await roleModel.findById(id);
    if (!role) throw new Error('Cargo não encontrado.');
    return role
}

async function update(id, data) {
    const role = await roleModel.findById(id);
    if (!role) throw new Error('Id não encontrado.');

    if (!data) throw new Error('Nome do cargo é obrigatório.');

    await roleModel.update(id, data);
    return { success: true, message: `Cargo '${data}' atualizado com sucesso.` };
}

async function remove(id) {
    const role = await roleModel.findById(id);
    if (!role) throw new Error('Id não encontrado.');
    await roleModel.remove(id);
    return { success: true };
}

export const roleService = {
    create,
    findById,
    update,
    findAll,
    remove,
}
