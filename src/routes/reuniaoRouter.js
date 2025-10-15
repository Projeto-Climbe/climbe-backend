import { Router } from 'express';
import reuniaoController from '../controller/reuniaoController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

router.use(authMiddleware);

router.post('/', reuniaoController.agendar);
router.get('/', reuniaoController.getAll);
router.get('/:id', reuniaoController.getById);
router.put('/:id', reuniaoController.update);
router.delete('/:id', reuniaoController.remove);

export default router;
