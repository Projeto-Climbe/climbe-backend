import participanteModel from '../model/participanteReuniaoModel.js';

const addParticipante = async (data) => {
  const { id_reuniao, id_usuario, id_empresa } = data;

  if (!id_reuniao || !id_usuario || !id_empresa) {
    throw new Error('Campos obrigatórios: id_reuniao, id_usuario e id_empresa.');
  }

  const existente = await participanteModel.findByIds(id_reuniao, id_usuario);
  if (existente) {
    throw new Error('Usuário já adicionado a essa reunião.');
  }

  return participanteModel.add(data);
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