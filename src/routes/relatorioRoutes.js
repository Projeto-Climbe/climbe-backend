import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import relatorioController from '../controller/relatorioController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', relatorioController.create);
router.get('/', relatorioController.getAll);
router.get('/contrato/:contratoId', relatorioController.getByContratoId);
router.get('/:id', relatorioController.getById);
router.delete('/:id', relatorioController.remove);

export default router;