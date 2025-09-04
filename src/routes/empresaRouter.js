import express from 'express';
import empresaController from '../controller/empresaController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', empresaController.create);
router.get('/', empresaController.getAll);
router.get('/:id', empresaController.getById);
router.put('/:id', empresaController.update);
router.delete('/:id', empresaController.remove);

export default router;