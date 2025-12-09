import { Router } from 'express';
import { staffRoute } from './staff.route.js';
import { userRoute } from './user.route.js';
import { shiftRoute } from './shift.route.js';
import { branchRoute } from './branch.route.js';
import { attendanceRoute } from './attendance.route.js';
import { ShiftAssignmentRoute } from './shift-assignment.route.js';

const router: Router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/staffs',
        route: staffRoute,
    },
    {
        path: '/branches',
        route: branchRoute,
    },
    {
        path: '/shifts',
        route: shiftRoute,
    },
    {
        path: '/shift-assignments',
        route: ShiftAssignmentRoute,
    },
    {
        path: '/attendance',
        route: attendanceRoute,
    },
];

moduleRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
