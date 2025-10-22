import { companyServiceService } from '../service/companyServiceService.js';

export async function create(req, res) {
  try {
    const companyService = await companyServiceService.create(req.body);
    res.status(201).json(companyService);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findAll(req, res) {
  try {
    const companyServices = await companyServiceService.findAll();
    res.json({ companyServices });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const companyService = await companyServiceService.findById(id);
    res.json({ companyService });
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const result = await companyServiceService.update(id, req.body);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const result = await companyServiceService.remove(id);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}
