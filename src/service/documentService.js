import { documentModel } from "../model/documentModel.js";

async function create(data) {
    if (!data) {
        throw new Error('Os dados precisam ser preenchidos.');
    }

    const isAnalyst = await documentModel.isAnalyst(data.analystId);
    if (!isAnalyst || isAnalyst.role !== 'Analista') {
        throw new Error('Apenas analistas podem criar documentos! Esse usuário não é analista.');
    }

    return await documentModel.save(data);
}

async function findById(id) {
    const document = await documentModel.findById(id);
    if (!document) throw new Error('Documento não encontrado.');
    return document;
}

async function findAll() {
    const documents = await documentModel.findMany();

    if (documents.length === 0) {
        throw new Error('Nenhum documento encontrado.');
    }

    return documents;
}

async function update(id, data) {
    const document = await documentModel.findById(id);
    if (!document) throw new Error('Id não encontrado.');

    if (!data) throw new Error('Dados para atualização são obrigatórios.');

    await documentModel.update(id, data);
    return { success: true, message: `Documento atualizado com sucesso.` };
}

async function remove(id) {
    const document = await documentModel.findById(id);
    if (!document) throw new Error('Documento não encontrado.');

    await documentModel.delete(id);
    return { success: true, message: 'Documento removido com sucesso.' };
}

export const documentService = {
    create,
    findById,
    findAll,
    update,
    remove
};
