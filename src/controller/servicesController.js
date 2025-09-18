import { servicesService } from '../service/servicesService.js';

export async function create(req, res) {
  try { 
    const role = await servicesService.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findAll(req, res) {
  try {
    const services = await servicesService.findAll();
    res.json({ services });
  } catch (error) {
    const status = error.message.includes('Nenhum serviço encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function findById(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) throw new Error('ID inválido.');

    const services = await servicesService.findById(id);
    res.json({ services });
  } catch (error) {
    const status = error.message.includes('Não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function findByName(req, res) {
  try {
    const { name } = req.query;
    if (!name) throw new Error('Nome do serviço é obrigatório.');
    const services = await servicesService.findByName(name);
    res.json({ services });
  } catch (error) {
    const status = error.message.includes('Não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');
    const { name } = req.body;
    const result = await servicesService.update(id, name);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('Não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function remove(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error('ID inválido.');
        const result = await servicesService.remove(id);
        res.json(result);
    } catch (error) {
        const status = error.message.includes('Não encontrado') ? 404 : 400;
        res.status(status).json({ error: error.message });
    }
}