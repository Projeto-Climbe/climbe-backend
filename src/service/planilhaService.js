import { planilhaModel } from "../model/planilhaModel.js";

async function create(data) {
    if (!data) { 
        throw new Error('Os dados precisam ser preenchidos.');
    }

    return await planilhaModel.save(data);
}

async function findById(id) {
    const planilha = await planilhaModel.findById(id);
    if (!planilha) throw new Error('Planilha não encontrada.');
    return planilha;
}

async function findAll() {
    const planilhas = await planilhaModel.findMany();

    if (planilhas.length === 0) {
        throw new Error('Nenhuma planilha encontrada.');
    }

    return planilhas;
}

async function update(id, data) {
    const planilha = await planilhaModel.findById(id);
    if (!planilha) throw new Error('Id não encontrado.');

    if (!data) throw new Error('Dados para atualização são obrigatórios.');

    await planilhaModel.update(id, data);
    return { success: true, message: `Planilha atualizada com sucesso.` };
}

async function remove(id) {
    const planilha = await planilhaModel.findById(id);
    if (!planilha) throw new Error('Planilha não encontrada.');

    await planilhaModel.delete(id);
    return { success: true, message: 'Planilha removida com sucesso.' };
}

export const planilhaService = {
    create,
    findById,
    findAll,
    update,
    remove
};
