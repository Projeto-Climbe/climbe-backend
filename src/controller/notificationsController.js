import { notificationsService } from '../service/notificationsService.js';

export async function create(req, res) {
  try {
    const notification = await notificationsService.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findAll(req, res) {
  try {
    const notifications = await notificationsService.findAll();
    res.json({ notifications });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function findById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const notification = await notificationsService.findById(id);
    res.json({ notification });
  } catch (error) {
    const status = error.message.includes('não encontrada') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new Error('ID inválido.');

    const { userId, message } = req.body;
    const result = await notificationsService.update(id, userId, message);
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

    const result = await notificationsService.remove(id);
    res.json(result);
  } catch (error) {
    const status = error.message.includes('não encontrada') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}
