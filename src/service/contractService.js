import contratoModel from '../model/contractModel.js';

const createContrato = async (contratoData) => {
  if (!contratoData.id_proposta) {
    throw new Error('O ID da proposta é obrigatório para criar um contrato.');
  }
  return contratoModel.create(contratoData);
};

const getContratoById = async (id) => {
  const contrato = await contratoModel.findById(id);
  if (!contrato) {
    throw new Error('Contrato não encontrado.');
  }
  return contrato;
};

const getAllContratos = async () => {
  return contratoModel.findAll();
};

const updateContrato = async (id, contratoData) => {
  // Poderia ter lógica adicional, como garantir que o status seja válido.
  return contratoModel.update(id, contratoData);
};

const deleteContrato = async (id) => {
  const contrato = await contratoModel.findById(id);
  if (!contrato) {
    throw new Error('Contrato não encontrado para exclusão.');
  }
  return contratoModel.remove(id);
};

export default {
  createContrato,
  getContratoById,
  getAllContratos,
  updateContrato,
  deleteContrato,
};