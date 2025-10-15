import { planilhaService } from '../service/planilhaService.js';
import * as googleSheetsService from '../service/googleSheetsService.js';

export async function create(req, res) {
  try {
    const { id_contrato, nomePlanilha, userEmail } = req.body;
    const auth = req.googleAuth; // Service Account ou OAuth2

    // Criar cópia da planilha template
    const sheetId = await googleSheetsService.createSheetCopy(auth, process.env.SHEET_TEMPLATE_ID, nomePlanilha);

    // Dar permissões de acesso
    await googleSheetsService.setSheetPermissions(auth, sheetId, userEmail, 'writer');

    // Proteger primeira aba
    await googleSheetsService.protectSheet(auth, sheetId);

    // Criar registro no banco
    const planilha = await planilhaService.create({
      id_contrato,
      url_google_sheets: `https://docs.google.com/spreadsheets/d/${sheetId}`,
      blocked: false,
      view_permission: 'editor',
    });

    res.status(201).json(planilha);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Falha ao criar planilha' });
  }
}

// Outros métodos (findAll, findById, update, remove) podem chamar diretamente planilhaService
export async function findAll(req, res) {
  try {
    const planilhas = await planilhaService.findAll();
    res.json(planilhas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function findById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const planilha = await planilhaService.findById(id);
    res.json(planilha);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const result = await planilhaService.update(id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    const result = await planilhaService.remove(id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
