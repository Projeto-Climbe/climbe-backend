import contractsService from '../service/contracts.service.js';

class ContractsController {
  async post(req, res) {
    try {
      const newContract = await contractsService.createContract(req.body);
      res.status(201).json(newContract);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async get(req, res) {
    try {
      const id = parseInt(req.params.id);
      const contract = await contractsService.getContract(id);
      res.status(200).json(contract);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const userRole = req.user?.role || 'default'; // Exemplo de como obter a permissão
      await contractsService.deleteContract(id, userRole);
      res.status(204).end();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const contracts = await contractsService.getAllContracts();
      res.status(200).json(contracts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ContractsController();