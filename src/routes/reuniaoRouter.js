import { Router } from 'express';
import reuniaoController from '../controller/reuniao.controller.js';

const router = Router();

router.post('/', reuniaoController.agendar);
router.get('/', reuniaoController.getAll);
router.get('/:id', reuniaoController.getById);
router.put('/:id', reuniaoController.update);
router.delete('/:id', reuniaoController.remove);

export default router;