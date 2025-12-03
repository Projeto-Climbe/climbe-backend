import { planilhaService } from '../service/planilhaService.js';
import axios from 'axios';
import FormData from 'form-data';

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

export async function uploadAndSendToWebhook(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error('Nenhum arquivo foi enviado.');
    }

    if (req.files.length > 1) {
      throw new Error('Apenas um arquivo pode ser enviado por vez.');
    }

    const webhookUrl = 'https://n8n.fluxiaapp.com.br/webhook/drive';

    const formData = new FormData();
    const file = req.files[0];
    formData.append('files', file.buffer, file.originalname); // Envia apenas um arquivo

    console.log(req.files);

    const response = await axios.post(webhookUrl, formData, {
      headers: formData.getHeaders(),
    });

    res.status(200).json({ message: 'Arquivo enviado com sucesso.', data: response.data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
