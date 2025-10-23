import express from 'express';

import * as authController from '../controller/authController.js';
import * as userController from '../controller/userController.js';

const router = express.Router();

// Recuperação e redefinição de senha (público)
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

router.post('/signup', userController.singup);
router.post('/login', userController.login);

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleCallback)

export default router;