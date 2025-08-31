import { roleService } from '../service/roleService.js';

export async function create(req, res) {
  try { 
    const role = await roleService.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findAll(req, res) {
  try {
    const roles = await roleService.findAll();
    res.json({ roles });
  } catch (error) {
    const status = error.message.includes('Nenhum cargo encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function findById(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) throw new Error('ID inválido.');

    const role = await roleService.findById(id);
    res.json({ role });
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
    const result = await roleService.update(id, name);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('Não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}
