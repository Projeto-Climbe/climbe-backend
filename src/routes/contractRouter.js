import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import contractController from '../controller/contractController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', contractController.create);
router.get('/', contractController.getAll);
router.get('/:id', contractController.getById);
router.delete('/:id', contractController.remove);

export default router;