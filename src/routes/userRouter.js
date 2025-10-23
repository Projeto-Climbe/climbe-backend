import express from 'express';

import * as userController from '../controller/userController.js';
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();

router.patch('/change-password', userController.changePassword);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', authMiddleware, userController.resetPassword);

router.post('/email', authMiddleware, userController.getUserByEmail);

router.get('/pending', authMiddleware, userController.getPendingUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.get('/', authMiddleware, userController.getAllUsers);

router.patch('/:id/status', authMiddleware, userController.updateUserStatus);
router.patch('/:id/role', authMiddleware, userController.assignRoleToUser);

router.delete('/:id', authMiddleware, userController.remove);

export default router;
