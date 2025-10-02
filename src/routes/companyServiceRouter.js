import express from 'express';

import * as companyServiceController from '../controller/companyServiceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', companyServiceController.create);
router.get('/:id', companyServiceController.findById);
router.get('/', companyServiceController.findAll);
router.patch('/:id', companyServiceController.update);
router.delete('/:id', companyServiceController.remove);

export default router;
