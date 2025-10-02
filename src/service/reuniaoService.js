import reuniaoModel from '../model/reuniaoModel.js';

const agendarReuniao = async (reuniaoData) => {
  if (!reuniaoData.empresa_id || !reuniaoData.titulo || !reuniaoData.data || !reuniaoData.hora) {
    throw new Error('ID da empresa, título, data e hora são obrigatórios para agendamento.');
  }

  reuniaoData.status = reuniaoData.status || 'Agendada'; 
  return reuniaoModel.create(reuniaoData);
};

const getReuniaoById = async (id) => {
  const reuniao = await reuniaoModel.findById(id);
  if (!reuniao) {
    throw new Error('Reunião não encontrada.');
  }
  return reuniao;
};

const getAllReunioes = async () => {
  return reuniaoModel.findAll();
};

const updateReuniao = async (id, reuniaoData) => {
    return reuniaoModel.update(id, reuniaoData);
};

const deleteReuniao = async (id) => {
  const reuniao = await reuniaoModel.findById(id);
  if (!reuniao) {
    throw new Error('Reunião não encontrada para exclusão.');
  }
  return reuniaoModel.remove(id);
};

export default {
  agendarReuniao,
  getReuniaoById,
  getAllReunioes,
  updateReuniao,
  deleteReuniao,
};