import * as planilhaService from '../service/planilhaService.js';
import * as googleSheetsService from '../service/googleSheetsService.js';
import { getGoogleAuth } from '../config/googleAuth.js'; // Aqui está a correção

// Cria uma nova planilha com base em um template no Google Drive
export async function create(req, res) {
  try {
    const { id_contrato, nomePlanilha, userEmail } = req.body;

    const auth = getGoogleAuth(); // <-- autenticação do Google

    const sheetId = await googleSheetsService.createSheetCopy(
      auth,
      process.env.SHEET_TEMPLATE_ID,
      nomePlanilha
    );

    await googleSheetsService.setSheetPermissions(auth, sheetId, userEmail, 'writer');
    await googleSheetsService.protectSheet(auth, sheetId);

    const planilha = await planilhaService.create({
      id_contrato,
      url_google_sheets: `https://docs.google.com/spreadsheets/d/${sheetId}`,
      blocked: false,
      view_permission: 'editor',
    });

    return res.status(201).json(planilha);
  } catch (err) {
    console.error('Erro ao criar planilha:', err);
    return res.status(500).json({ error: err.message || 'Falha ao criar planilha' });
  }
}

export async function findAll(req, res) {
  try {
    const planilhas = await planilhaService.findAll();
    return res.json(planilhas);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function findById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const planilha = await planilhaService.findById(id);
    return res.json(planilha);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updated = await planilhaService.update(id, req.body);
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    const deleted = await planilhaService.remove(id);
    return res.json(deleted);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
