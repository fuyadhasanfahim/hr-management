import type { Request, Response, NextFunction } from 'express';

export const grantedAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = req.user?.role;
        if (userRole && !roles.includes(userRole)) {
            res.status(403).json({ success: false, message: 'Access denied' });
            return;
        }
        next();
    };
};
