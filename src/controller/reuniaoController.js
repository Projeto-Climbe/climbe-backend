import reuniaoService from '../service/reuniao.service.js';

const agendar = async (req, res) => {
  try {
    const newReuniao = await reuniaoService.agendarReuniao(req.body);
    res.status(201).json(newReuniao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const reuniao = await reuniaoService.getReuniaoById(id);
    res.status(200).json(reuniao);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const reunioes = await reuniaoService.getAllReunioes();
    res.status(200).json(reunioes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar reuniões.' });
  }
};

const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedReuniao = await reuniaoService.updateReuniao(id, req.body);
    res.status(200).json(updatedReuniao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await reuniaoService.deleteReuniao(id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export default {
  agendar,
  getById,
  getAll,
  update,
  remove,
};