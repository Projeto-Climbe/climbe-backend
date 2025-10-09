import relatorioService from '../service/relatorioService.js';

const create = async (req, res) => {
  try {
    const newRelatorio = await relatorioService.createRelatorio(req.body);
    res.status(201).json(newRelatorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const relatorio = await relatorioService.getRelatorioById(id);
    res.status(200).json(relatorio);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getByContratoId = async (req, res) => {
  try {
    const contratoId = parseInt(req.params.contratoId);
    const relatorios = await relatorioService.getRelatoriosByContratoId(contratoId);
    res.status(200).json(relatorios);
  } catch (error) {
    res.status(404).json({ error: 'Relatórios não encontrados para este contrato.' });
  }
};

const getAll = async (req, res) => {
  try {
    const relatorios = await relatorioService.getAllRelatorios();
    res.status(200).json(relatorios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relatórios.' });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await relatorioService.deleteRelatorio(id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export default {
  create,
  getById,
  getByContratoId,
  getAll,
  remove,
};