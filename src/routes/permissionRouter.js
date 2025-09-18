import express from 'express';

import * as permissionController from '../controller/permissionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', permissionController.create);
router.get('/:id', permissionController.findById);
router.get('/', permissionController.findAll);
router.patch('/:id', permissionController.update);
router.delete('/:id', permissionController.remove);

export default router;
