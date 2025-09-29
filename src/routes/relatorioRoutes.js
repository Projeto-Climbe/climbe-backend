import { Router } from 'express';
import relatorioController from '../controller/relatorio.controller.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

router.use(authMiddleware);

router.post('/', relatorioController.create);
router.get('/', relatorioController.getAll);
router.get('/contrato/:contratoId', relatorioController.getByContratoId);
router.get('/:id', relatorioController.getById);
router.delete('/:id', relatorioController.remove);

export default router;