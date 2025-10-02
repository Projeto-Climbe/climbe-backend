import contractsService from '../service/contractService.js';

class ContractsController {
  async post(req, res) {
    try {
      const newContract = await contractsService.createContrato(req.body);
      res.status(201).json(newContract);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async get(req, res) {
    try {
      const id = parseInt(req.params.id);
      const contract = await contractsService.getContratoById(id);
      res.status(200).json(contract);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const contracts = await contractsService.getAllContratos();
      res.status(200).json(contracts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async patch(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedContract = await contractsService.updateContrato(id, req.body);
      res.status(200).json(updatedContract);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const userRole = req.user?.role || 'default';
      await contractsService.deleteContrato(id);
      res.status(204).end();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}

export default new ContractsController();
