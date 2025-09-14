import { servicesModel } from '../model/servicesModel.js';

async function create(data) {
    if (!data) {
        throw new Error('O nome do serviço é obrigatório.');
    }
    return await servicesModel.save(data);
}

async function findAll() {
    const services = await servicesModel.findMany();
    if (services.length === 0) {
        throw new Error('Nenhum serviço encontrado.');
    }
    return services;
}

async function findById(id) {
    const service = await servicesModel.findById(id);
    if (!service) throw new Error('Serviço não encontrado.');
    return service;
}

async function findByName(name) {
    const service = await servicesModel.findByName(name);
    if (!service) throw new Error('Serviço não encontrado.');
    return service;
}

async function update(id, data) {
    const service = await servicesModel.findById(id);
    if (!service) throw new Error('Id não encontrado.');
    if (!data) throw new Error('Nome do serviço é obrigatório.');
    await servicesModel.update(id, data);
    return { success: true, message: `Serviço '${data}' atualizado com sucesso.` };
}

async function remove(id) {
    const service = await servicesModel.findById(id);
    if (!service) throw new Error('Id não encontrado');
    await servicesModel.delete(id);
    return { success: true, message: `Serviço '${service}' removido com sucesso.` };
}

export const servicesService = {
    create,
    findById,
    update,
    findAll,
    findByName,
    remove,
}