import express from 'express';

import * as userController from '../controller/userController.js';
import * as authController from '../controller/authController.js';
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();

// Recuperação e redefinição de senha (público)
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleCallback);


router.use(authMiddleware);

// Troca de senha autenticado
router.patch('/change-password', userController.changePassword);

router.post('/email', userController.getUserByEmail);

router.get('/pending', userController.getPendingUsers);
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers);

router.patch('/:id/status', userController.updateUserStatus);
router.patch('/:id/role', userController.assignRoleToUser);

router.delete('/:id', userController.remove);

export default router;
