import type { Request, Response } from 'express';
import analyticsService from '../services/analytics.service.js';

async function getFinanceAnalytics(req: Request, res: Response) {
    try {
        const year = req.query.year
            ? parseInt(req.query.year as string)
            : undefined;
        const months = req.query.months
            ? parseInt(req.query.months as string)
            : 12;

        const analytics = await analyticsService.getFinanceAnalytics({
            year,
            months,
        });

        res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        console.error('Error getting finance analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch finance analytics',
        });
    }
}

export default {
    getFinanceAnalytics,
};
