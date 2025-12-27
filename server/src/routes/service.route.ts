import { Router } from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
} from '../controllers/service.controller.js';

const router = Router();

router.post('/', createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.patch('/:id', updateService);
router.delete('/:id', deleteService);

export { router as serviceRoute };
