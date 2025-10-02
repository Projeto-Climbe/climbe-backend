import express from 'express';
import { getWeeklyAgenda, getMonthlyAgenda } from '../controller/calendarController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/week', getWeeklyAgenda);
router.get('/month', getMonthlyAgenda);

export default router;
