import { Router } from 'express';
import AnalyticsController from '../controllers/analytics.controller.js';
import { authorize } from '../middlewares/authorize.js';
import { Role } from '../consonants/role.js';

const router: Router = Router();

router.get(
    '/dashboard',
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
    AnalyticsController.getDashboardAnalytics
);

router.get(
    '/salary-history/:staffId',
    authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
    AnalyticsController.getSalaryHistory
);

router.get(
    '/audit-logs',
    authorize(Role.SUPER_ADMIN, Role.ADMIN),
    AnalyticsController.getAuditLogs
);

export const analyticsRoute = router;
