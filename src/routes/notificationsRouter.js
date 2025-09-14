import express from 'express';
import * as notificationsController from '../controller/notificationsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();


router.post('/', notificationsController.create);
router.get('/', notificationsController.findAll);
router.get('/:id', notificationsController.findById);
router.patch('/:id', notificationsController.update);
router.delete('/:id', notificationsController.remove);

router.use(authMiddleware);

export default router;
