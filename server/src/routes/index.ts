import { Router } from 'express';
import { staffRoute } from './staff.route.js';
import { userRoute } from './user.route.js';
import { shiftRoute } from './shift.route.js';
import { branchRoute } from './branch.route.js';

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
        path: '/shifts',
        route: shiftRoute,
    },
    {
        path: '/branches',
        route: branchRoute,
    },
];

moduleRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
