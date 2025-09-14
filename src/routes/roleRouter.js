import express from 'express';

import * as roleController from '../controller/roleController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', roleController.create);

router.get('/:id', roleController.findById);
router.get('/', roleController.findAll);

router.patch('/:id', roleController.update);

router.delete('/:id', roleController.remove);

router.use(authMiddleware);

export default router;
