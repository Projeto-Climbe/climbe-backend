import { planilhaModel } from '../model/planilhaModel.js';

async function create(data) {
  if (!data) throw new Error('Os dados precisam ser preenchidos.');

  const planilhaData = {
    id_contrato: data.id_contrato,
    url_google_sheets: data.url_google_sheets || null,
    blocked: data.blocked || false,
    view_permission: data.view_permission || 'editor',
  };

  return await planilhaModel.save(planilhaData);
}

async function findById(id) {
  const planilha = await planilhaModel.findById(id);
  if (!planilha) throw new Error('Planilha não encontrada.');
  return planilha;
}

async function findAll() {
  const planilhas = await planilhaModel.findMany();
  if (!planilhas.length) throw new Error('Nenhuma planilha encontrada.');
  return planilhas;
}

async function update(id, data) {
  const planilha = await planilhaModel.findById(id);
  if (!planilha) throw new Error('Planilha não encontrada.');
  if (!data) throw new Error('Dados para atualização são obrigatórios.');

  const updateData = {
    id_contrato: data.id_contrato ?? planilha.id_contrato,
    url_google_sheets: data.url_google_sheets ?? planilha.url_google_sheets,
    blocked: data.blocked ?? planilha.blocked,
    view_permission: data.view_permission ?? planilha.view_permission,
  };

  await planilhaModel.update(id, updateData);
  return { success: true, message: 'Planilha atualizada com sucesso.' };
}

async function remove(id) {
  const planilha = await planilhaModel.findById(id);
  if (!planilha) throw new Error('Planilha não encontrada.');
  await planilhaModel.delete(id);
  return { success: true, message: 'Planilha removida com sucesso.' };
}

export const planilhaService = { create, findById, findAll, update, remove };
