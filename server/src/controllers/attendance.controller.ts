import type { Request, Response } from 'express';
import AttendanceServices from '../services/attendance.service.js';

const checkIn = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const ip = req.ip;
        const userAgent = req.headers['user-agent'] || '';

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        if (!ip) {
            return res.status(400).json({
                success: false,
                message: 'IP address is required',
            });
        }

        const result = await AttendanceServices.checkInInDB({
            userId,
            ip,
            userAgent,
            source: 'web',
        });

        return res.status(200).json({
            success: true,
            message: 'Checked in successfully',
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message || 'Failed to check in',
        });
    }
};

const AttendanceController = { checkIn };
export default AttendanceController;
