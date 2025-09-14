import express from 'express';

import * as servicesController from '../controller/servicesController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', servicesController.create);

router.get('/:id', servicesController.findById);
router.get('/name', servicesController.findByName);
router.get('/', servicesController.findAll);

router.patch('/:id', servicesController.update);

router.delete('/:id', servicesController.remove);

router.use(authMiddleware);

export default router;