import express from 'express';

import * as planilhaController from '../controller/planilhaController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', planilhaController.create);
router.get('/:id', planilhaController.findById);
router.get('/', planilhaController.findAll);
router.patch('/:id', planilhaController.update);
router.delete('/:id', planilhaController.remove);

export default router;
