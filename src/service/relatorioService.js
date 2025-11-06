import relatorioModel from '../model/relatorioModel.js';

const createRelatorio = async (relatorioData) => {
  if (!relatorioData.contrato_id || !relatorioData.url_pdf) {
    throw new Error('ID do contrato e URL do PDF são obrigatórios para criar um relatório.');
  }
  return await relatorioModel.create(relatorioData);
};

const getRelatorioById = async (id) => {
  const relatorio = await relatorioModel.findById(id);
  if (!relatorio) {
    throw new Error('Relatório não encontrado.');
  }
  return relatorio;
};

const getRelatoriosByContratoId = async (contratoId) => {
  return await relatorioModel.findByContratoId(contratoId);
};

const getAllRelatorios = async () => {
  return relatorioModel.findAll();
};

const deleteRelatorio = async (id) => {
  const relatorio = await relatorioModel.findById(id);
  if (!relatorio) {
    throw new Error('Relatório não encontrado para exclusão.');
  }
  return relatorioModel.remove(id);
};

export default {
  createRelatorio,
  getRelatorioById,
  getRelatoriosByContratoId,
  getAllRelatorios,
  deleteRelatorio,
};