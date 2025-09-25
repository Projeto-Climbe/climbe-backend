import participanteService from '../service/participanteReuniao.service.js';

const add = async (req, res) => {
  try {
    const newParticipante = await participanteService.addParticipante(req.body);
    res.status(201).json(newParticipante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getByReuniaoId = async (req, res) => {
  try {
    const reuniaoId = parseInt(req.params.reuniaoId);
    const participantes = await participanteService.getParticipantesByReuniao(reuniaoId);
    res.status(200).json(participantes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const reuniaoId = parseInt(req.params.reuniaoId);
    const usuarioId = parseInt(req.params.usuarioId);
    
    await participanteService.removeParticipante(reuniaoId, usuarioId);
    res.status(204).end(); // 204 No Content para remoção bem-sucedida
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export default {
  add,
  getByReuniaoId,
  remove,
};