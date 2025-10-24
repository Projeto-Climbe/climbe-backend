import { documentModel } from "../model/documentModel.js";
import { uploadToMinio } from '../storage/minioUpload.js';

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

// Faz upload do arquivo no MinIO e atualiza o registro do documento
async function uploadFile(id, file) {
    try {
        if (!file) {
            console.error('[UploadFile] Nenhum arquivo enviado.');
            throw new Error('Arquivo não enviado.');
        }
        const document = await documentModel.findById(id);
        if (!document) {
            console.error(`[UploadFile] Documento não encontrado para id: ${id}`);
            throw new Error('Documento não encontrado.');
        }

        // Faz upload no MinIO
        let minioResult;
        try {
            minioResult = await uploadToMinio(file, document.id_empresa, document.type);
        } catch (err) {
            console.error('[UploadFile] Erro ao fazer upload no MinIO:', err);
            throw new Error('Falha ao fazer upload do arquivo no MinIO.');
        }

        // Atualiza o registro do documento com a URL e marca como não validado
        try {
            await documentModel.update(id, {
                url: minioResult.url,
                validated: false
            });
        } catch (err) {
            console.error('[UploadFile] Erro ao atualizar registro do documento:', err);
            throw new Error('Falha ao atualizar o documento após upload.');
        }

        return {
            success: true,
            url: minioResult.url,
            documentId: id
        };
    } catch (err) {
        console.error('[UploadFile] Erro geral:', err);
        throw err;
    }
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
    remove,
    uploadFile
};
