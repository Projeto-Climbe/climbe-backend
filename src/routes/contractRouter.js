import { Router } from 'express';
import contratoController from '../controller/contractController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

router.use(authMiddleware);

router.post('/', contratoController.post);
router.get('/', contratoController.getAll);
router.get('/:id', contratoController.get);
router.patch('/:id', contratoController.patch);
router.delete('/:id', contratoController.delete);

export default router;