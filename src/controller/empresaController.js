import empresaService from '../service/empresaService.js';

import { uploadToMinio } from '../storage/minioUpload.js';

const create = async (req, res) => {
  try {
    // Adicionar validação de dados aqui (ex: com Joi ou express-validator)
    const empresa = await empresaService.createEmpresa(req.body);
    // Mensagem de sucesso ao finalizar o cadastro [cite: 177]
    res.status(201).json({ message: 'Empresa cadastrada com sucesso!', data: empresa });
  } catch (error) {
    // Mensagem descritiva em caso de erro [cite: 178]
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const empresas = await empresaService.getAllEmpresas();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empresas.' });
  }
};

const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const empresa = await empresaService.getEmpresaById(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    res.status(200).json(empresa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empresa.' });
  }
};

const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const empresa = await empresaService.updateEmpresa(id, req.body);
    res.status(200).json({ message: 'Empresa atualizada com sucesso!', data: empresa });
  } catch (error) {
     // Prisma lança um erro específico se o registro a ser atualizado não for encontrado
    if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Empresa não encontrada para atualização.' });
    }
    res.status(400).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await empresaService.deleteEmpresa(id);
    res.status(204).send(); // 204 No Content é uma boa prática para DELETE
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Empresa não encontrada para exclusão.' });
    }
    res.status(500).json({ message: 'Erro ao deletar empresa.' });
  }
};

const uploadDocumento = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const tipoDocumento = req.body.tipoDocumento || 'documento';
    if (!req.file) {
      return res.status(400).json({ message: 'Arquivo não enviado.' });
    }
    const result = await uploadToMinio(req.file, empresaId, tipoDocumento);
    res.status(201).json({ message: 'Documento enviado com sucesso!', ...result });
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error);
    res.status(500).json({
      message: 'Erro ao fazer upload do documento.',
      error: error.stack || error.message || String(error)
    });
  }
};

export default {
  create,
  getAll,
  getById,
  update,
  remove,
  uploadDocumento,
};