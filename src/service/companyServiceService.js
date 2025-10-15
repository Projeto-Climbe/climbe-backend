import { companyServiceModel } from "../model/companyServiceModel.js";

async function create(data) {
    if (!data) { 
        throw new Error('Os dados precisam ser preenchidos.');
    }

    return await companyServiceModel.save(data);
}

async function findById(id) {
    const companyService = await companyServiceModel.findById(id);
    if (!companyService) throw new Error('Serviço da empresa não encontrado.');
    return companyService;
}

async function findAll() {
    const companyServices = await companyServiceModel.findMany();

    if (companyServices.length === 0) {
        throw new Error('Nenhum serviço de empresa encontrado.');
    }

    return companyServices;
}

async function update(id, data) {
    const companyService = await companyServiceModel.findById(id);
    if (!companyService) throw new Error('Id não encontrado.');

    if (!data) throw new Error('Dados para atualização são obrigatórios.');

    await companyServiceModel.update(id, data);
    return { success: true, message: `Serviço da empresa atualizado com sucesso.` };
}

async function remove(id) {
    const companyService = await companyServiceModel.findById(id);
    if (!companyService) throw new Error('Serviço da empresa não encontrado.');

    await companyServiceModel.delete(id);
    return { success: true, message: 'Serviço da empresa removido com sucesso.' };
}

export const companyServiceService = {
    create,
    findById,
    findAll,
    update,
    remove
};
