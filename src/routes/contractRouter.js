import { Router } from 'express';
import contratoController from '../controller/contrato.controller.js';

const router = Router();

router.post('/', contratoController.create);
router.get('/', contratoController.getAll);
router.get('/:id', contratoController.getById);
router.put('/:id', contratoController.update);
router.delete('/:id', contratoController.remove);

export default router;