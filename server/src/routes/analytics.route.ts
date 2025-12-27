import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller.js';

const router = Router();

// GET /api/analytics/finance - Get finance analytics
router.get('/finance', analyticsController.getFinanceAnalytics);

export const analyticsRoute = router;
