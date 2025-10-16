import representanteService from '../service/representanteService.js';

const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const representante = await representanteService.getRepresentanteById(id);
    res.status(200).json(representante);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const representantes = await representanteService.getAllRepresentantes(); 
    res.status(200).json(representantes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar lista de representantes.' });
  }
};

const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedRepresentante = await representanteService.updateRepresentante(id, req.body);
    res.status(200).json({ message: 'Representante atualizado com sucesso!', data: updatedRepresentante });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await representanteService.deleteRepresentante(id); 
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default {
  getById,
  getAll,
  update,
  remove,
};