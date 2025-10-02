import { documentService } from '../service/documentService.js';

export async function create(req, res) {
  try {
    const document = await documentService.create(req.body);
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findAll(req, res) {
  try {
    const documents = await documentService.findAll();
    res.json({ documents });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const document = await documentService.findById(id);
    res.json({ document });
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const result = await documentService.update(id, req.body);
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

    const result = await documentService.remove(id);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}
