import express from 'express';

import * as userController from '../controller/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/email', userController.getUserByEmail);

router.get('/pending', userController.getPendingUsers);
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers);

router.patch('/:id/status', userController.updateUserStatus);
router.patch('/:id/role', userController.assignRoleToUser);

router.delete('/:id', userController.remove);

export default router;  