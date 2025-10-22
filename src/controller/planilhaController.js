import { planilhaService } from '../service/planilhaService.js';

export async function create(req, res) {
  try {
    const planilha = await planilhaService.create(req.body);
    res.status(201).json(planilha);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findAll(req, res) {
  try {
    const planilhas = await planilhaService.findAll();
    res.json({ planilhas });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const planilha = await planilhaService.findById(id);
    res.json({ planilha });
  } catch (error) {
    const status = error.message.includes('não encontrada') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const result = await planilhaService.update(id, req.body);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('não encontrada') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const result = await planilhaService.remove(id);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('não encontrada') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}
