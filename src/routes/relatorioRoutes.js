import { Router } from 'express';
import relatorioController from '../controller/relatorio.controller.js';

const router = Router();

router.post('/', relatorioController.create);
router.get('/', relatorioController.getAll);
router.get('/contrato/:contratoId', relatorioController.getByContratoId);
router.get('/:id', relatorioController.getById);
router.delete('/:id', relatorioController.remove);

export default router;