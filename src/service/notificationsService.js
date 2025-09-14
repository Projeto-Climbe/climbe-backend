import { notificationsModel } from '../model/notificationsModel.js';

async function create(data) {
  if (!data?.userId || !data?.message) {
    throw new Error('userId e message são obrigatórios.');
  }

  return await notificationsModel.save(data);
}

async function findAll() {
    const notifications = await notificationsModel.findMany();
    if (notifications.length === 0) {
        throw new Error('Nenhuma notificação encontrada.');
    }
    return notifications;
}

async function findById(id) {
  const notification = await notificationsModel.findById(id);
  if (!notification) throw new Error('Notificação não encontrada.');
  return notification;
}

async function update(id, userId, message) {
  const existing = await notificationsModel.findById(id);
  if (!existing) throw new Error('Notificação não encontrada.');

  if (!userId || !message) {
    throw new Error('userId e message são obrigatórios para atualização.');
  }

  await notificationsModel.update(id, userId, message);
  return { success: true, message: 'Notificação atualizada com sucesso.' };
}

async function remove(id) {
  const existing = await notificationsModel.findById(id);
  if (!existing) throw new Error('Notificação não encontrada.');

  await notificationsModel.delete(id);
  return { success: true, message: 'Notificação removida com sucesso.' };
}

export const notificationsService = {
  create,
  findAll,
  findById,
  update,
  remove,
};
