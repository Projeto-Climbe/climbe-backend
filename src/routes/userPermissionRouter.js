import express from 'express';

import * as userPermssionController from '../controller/userPermissionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', userPermssionController.create);
router.get('/:id', userPermssionController.findById);
router.get('/', userPermssionController.findAll);
router.patch('/:id', userPermssionController.update);
router.delete('/:id', userPermssionController.remove);

export default router;
