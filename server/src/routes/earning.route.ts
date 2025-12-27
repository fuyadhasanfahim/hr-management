import { Router } from 'express';
import {
    createEarning,
    getAllEarnings,
    getEarningById,
    getOrdersForWithdrawal,
    getEarningStats,
    updateEarning,
    deleteEarning,
} from '../controllers/earning.controller.js';

const router = Router();

router.post('/', createEarning);
router.get('/', getAllEarnings);
router.get('/stats', getEarningStats);
router.get('/orders', getOrdersForWithdrawal);
router.get('/:id', getEarningById);
router.put('/:id', updateEarning);
router.delete('/:id', deleteEarning);

export { router as earningRoute };
