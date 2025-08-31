import express from 'express';

import * as permssionController from '../controller/permissionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', permssionController.create);

router.get('/:id', permssionController.findById);
router.get('/', permssionController.findAll);

router.patch('/:id', permssionController.update);

router.use(authMiddleware);

export default router;
