import { Router } from 'express';
import propostaController from '../controller/proposta.controller.js';

const router = Router();

router.post('/', propostaController.create);
router.get('/', propostaController.getAll);
router.get('/:id', propostaController.getById);
router.put('/:id', propostaController.update);
router.delete('/:id', propostaController.remove);

export default router;