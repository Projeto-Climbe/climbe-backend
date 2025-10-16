import express from 'express';
import { PlanilhaService } from '../service/planilhaService.js';

const router = express.Router();

// planilha modelo (cópia)
export const createCopy = async (req, res) => {
  try {
    const { idContrato } = req.params;
    const planilha = await PlanilhaService.criarCopiaPlanilha(Number(idContrato));
    res.json(planilha);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// planilha zerada (nova)
export const createNew = async (req, res) => {
  try {
    const { idContrato } = req.params;
    const { nome } = req.body;
    const planilha = await PlanilhaService.criarNovaPlanilha(Number(idContrato), nome);
    res.json(planilha);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export default router;
