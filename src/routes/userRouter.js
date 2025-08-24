import express from 'express';

import * as userController from '../controller/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.use(authMiddleware);

router.get('/pending', userController.getPendingUsers);
router.patch('/:id/status', userController.updateUserStatus);


export default router;