import { Router } from 'express';
import representanteController from '../controller/representanteController.js';

const router = Router();

router.post('/', representanteController.create);
router.get('/', representanteController.getAll);
router.get('/:id', representanteController.getById);
router.patch('/:id', representanteController.update);
router.delete('/:id', representanteController.remove);
export default router;