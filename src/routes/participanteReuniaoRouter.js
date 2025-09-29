import { Router } from 'express';
import participanteController from '../controller/participanteReuniao.controller.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

router.use(authMiddleware);

router.post('/', participanteController.add); 
router.get('/reuniao/:reuniaoId', participanteController.getByReuniaoId); 
router.delete('/:reuniaoId/:usuarioId', participanteController.remove);

export default router;