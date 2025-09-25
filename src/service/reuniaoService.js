import reuniaoModel from '../model/reuniao.model.js';
// import { googleCalendarService } from './googleCalendar.service.js'; // Exemplo de serviço de integração

const agendarReuniao = async (reuniaoData) => {
  // Lógica de validação: Valida se os dados essenciais estão presentes.
  if (!reuniaoData.empresa_id || !reuniaoData.titulo || !reuniaoData.data || !reuniaoData.hora) {
    throw new Error('ID da empresa, título, data e hora são obrigatórios para agendamento.');
  }
  
  // Lógica: Integração com serviços externos antes de salvar
  // Ex: const googleEvent = await googleCalendarService.schedule(reuniaoData);

  reuniaoData.status = reuniaoData.status || 'Agendada'; // Define um status padrão
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
    // Lógica: Se a data/hora for alterada, a integração com o Google Calendar deve ser chamada novamente.
    return reuniaoModel.update(id, reuniaoData);
};

const deleteReuniao = async (id) => {
  const reuniao = await reuniaoModel.findById(id);
  if (!reuniao) {
    throw new Error('Reunião não encontrada para exclusão.');
  }
  // Lógica: Cancelar a reunião no Google Calendar antes de deletar do banco
  // await googleCalendarService.cancel(id);
  return reuniaoModel.remove(id);
};

export default {
  agendarReuniao,
  getReuniaoById,
  getAllReunioes,
  updateReuniao,
  deleteReuniao,
};