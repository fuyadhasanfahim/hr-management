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

        await AttendanceServices.checkInInDB({
            userId,
            ip,
            userAgent,
            source: 'web',
        });

        return res.status(200).json({
            success: true,
            message: 'Checked in successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message || 'Failed to check in',
        });
    }
};

async function checkOut(req: Request, res: Response) {
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

        await AttendanceServices.checkOutInDB({
            userId,
            ip,
            userAgent,
            source: 'web',
        });

        return res.status(200).json({
            success: true,
            message: 'Checked out successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message || 'Failed to check out',
        });
    }
}

async function getTodayAttendance(req: Request, res: Response) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const attendance = await AttendanceServices.getTodayAttendanceFromDB(
            userId
        );

        return res.status(200).json({
            success: true,
            attendance,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                'Failed to fetch today\'s attendance. Please try again.',
        });
    }
}

const getMonthlyStats = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) throw new Error('Unauthorized');

        const result = await AttendanceServices.getMonthlyStatsInDB(userId);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch monthly stats',
        });
    }
};

const getMyAttendanceHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) throw new Error('Unauthorized');

        const days = parseInt(req.query.days as string) || 7;
        const result = await AttendanceServices.getMyAttendanceHistoryInDB(userId, days);
        
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch attendance history',
        });
    }
};

const AttendanceController = { 
    checkIn, 
    checkOut, 
    getTodayAttendance, 
    getMonthlyStats,
    getMyAttendanceHistory,
};
export default AttendanceController;
