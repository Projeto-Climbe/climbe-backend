import express from 'express';

import * as documentController from '../controller/documentController.js';
import { authMiddleware } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', documentController.create);
router.post('/upload/:id', upload.single('file'), documentController.uploadFile);
router.get('/:id', documentController.findById);
router.get('/', documentController.findAll);
router.patch('/:id', documentController.update);
router.delete('/:id', documentController.remove);

export default router;
