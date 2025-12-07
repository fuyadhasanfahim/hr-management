import { Router } from 'express';
import { staffRoute } from './staff.route.js';
import { userRoute } from './user.route.js';

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
];

moduleRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
