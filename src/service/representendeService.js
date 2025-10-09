import representanteModel from '../model/representante.model.js';

const createRepresentante = async (representanteData) => {
  const { cpf } = representanteData;

  if (cpf) {
    const existingRepresentante = await representanteModel.findByCpf(cpf);
    if (existingRepresentante) {
      throw new Error('O CPF do representante já está cadastrado.');
    }
  }

  return representanteModel.create(representanteData);
};

const updateRepresentante = async (id, representanteData) => {
  if (representanteData.cpf) {
    const existing = await representanteModel.findByCpf(representanteData.cpf);
    if (existing && existing.id_representante !== id) {
      throw new Error('O novo CPF informado já está em uso por outro representante.');
    }
  }

  return representanteModel.update(id, representanteData);
};

const getRepresentanteById = async (id) => {
    const representante = await representanteModel.findById(id);
    if (!representante) {
      throw new Error('Representante não encontrado.');
    }
    return representante;
};

export default {
  createRepresentante,
  updateRepresentante,
  getRepresentanteById,
  // ...
};