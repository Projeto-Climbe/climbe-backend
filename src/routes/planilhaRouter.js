import express from 'express';
import { copyPlanilha } from '../service/googleSheetsService.js';

const router = express.Router();

router.get('/copy', async (req, res) => {
  try {
    const novaPlanilha = await copyPlanilha('1L7B5yld1YJg9PmduuE9O3u6YT-DrQE7G5USmQQia0sM', 'Cópia da Idade');
    res.json({
      sucesso: true,
      novaPlanilha,
    });
  } catch (err) {
    res.status(500).json({
      sucesso: false,
      erro: err.message,
    });
  }
});

export default router;
