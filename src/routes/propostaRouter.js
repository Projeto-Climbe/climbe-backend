import { Router } from 'express';
import propostaController from '../controller/propostaController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

router.use(authMiddleware);

router.post('/', propostaController.create);
router.get('/', propostaController.getAll);
router.get('/:id', propostaController.getById);
router.put('/:id', propostaController.update);
router.delete('/:id', propostaController.remove);

export default router;
