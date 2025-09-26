import propostaService from '../service/propostaService.js';

const create = async (req, res) => {
  try {
    const userId = req.user?.id;
    const payload = {
      ...req.body,
      usuario_id: userId,
    };
    const newProposta = await propostaService.createProposta(payload, userId);
    res.status(201).json(newProposta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const proposta = await propostaService.getPropostaById(id);
    res.status(200).json(proposta);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const propostas = await propostaService.getAllPropostas();
    res.status(200).json(propostas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar propostas.' });
  }
};

const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedProposta = await propostaService.updateProposta(id, req.body);
    res.status(200).json(updatedProposta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await propostaService.deleteProposta(id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export default {
  create,
  getById,
  getAll,
  update,
  remove,
};
