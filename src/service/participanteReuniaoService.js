import participanteModel from '../model/participanteReuniaoModel.js';

const addParticipante = async (data) => {
  const { id_reuniao, id_usuario } = data;
  
  if (!id_reuniao || !id_usuario) {
    throw new Error('ID da reunião e ID do usuário são obrigatórios.');
  }
  
  return participanteModel.add({ id_reuniao, id_usuario });
};

const getParticipantesByReuniao = async (reuniaoId) => {
  if (!reuniaoId) {
    throw new Error('ID da reunião é obrigatório.');
  }
  return participanteModel.findByReuniao(reuniaoId);
};

const removeParticipante = async (reuniaoId, usuarioId) => {
  if (!reuniaoId || !usuarioId) {
    throw new Error('ID da reunião e ID do usuário são obrigatórios para remoção.');
  }
  
  return participanteModel.remove(reuniaoId, usuarioId);
};

export default {
  addParticipante,
  getParticipantesByReuniao,
  removeParticipante,
};