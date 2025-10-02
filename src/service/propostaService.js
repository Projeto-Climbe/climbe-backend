import propostaModel from '../model/propostaModel.js';

const createProposta = async (propostaData, usuarioId) => {
  if (!propostaData.empresa_id || !propostaData.status) {
    throw new Error('ID da empresa e status são obrigatórios para criar uma proposta.');
  }

  if (!usuarioId) {
    throw new Error('Usuário responsável não informado.');
  }

  propostaData.usuario_id = usuarioId;
  propostaData.data_criacao = new Date();

  return propostaModel.create(propostaData);
};

const getAllPropostas = async () => {
  return propostaModel.findAll();
};

const getPropostaById = async (id) => {
  const proposta = await propostaModel.findById(id);
  if (!proposta) {
    throw new Error('Proposta não encontrada.');
  }
  return proposta;
};

const updateProposta = async (id, propostaData) => {
  if (propostaData.status === 'aceita') {
    // integração de contrato pode ser adicionada posteriormente
  }
  return propostaModel.update(id, propostaData);
};

const deleteProposta = async (id) => {
  const proposta = await propostaModel.findById(id);
  if (!proposta) {
    throw new Error('Proposta não encontrada para exclusão.');
  }
  return propostaModel.remove(id);
};

export default {
  createProposta,
  getAllPropostas,
  getPropostaById,
  updateProposta,
  deleteProposta,
};
