
import contractsService from '../service/contractService.js';


export async function create(req, res) {
  try {
    const newContract = await contractsService.createContrato(req.body);
    res.status(201).json(newContract);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


export async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const contract = await contractsService.getContratoById(id);
    res.status(200).json(contract);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}


export async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    await contractsService.deleteContrato(id);
    res.status(204).end();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
}



export async function getAll(req, res) {
  try {
    const contracts = await contractsService.getAllContratos();
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default {
  create,
  getById,
  remove,
  getAll,
};