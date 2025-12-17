import type { Request, Response } from 'express';
import AnalyticsService from '../services/analytics.service.js';
import AuditService from '../services/audit.service.js';
import StaffService from '../services/staff.service.js';

async function getDashboardAnalytics(_req: Request, res: Response) {
    try {
        const analytics = await AnalyticsService.getDashboardAnalytics();
        return res.json({ success: true, data: analytics });
    } catch (err) {
        return res.status(500).json({ success: false, message: (err as Error).message });
    }
}

async function getSalaryHistory(req: Request, res: Response) {
    try {
        const { staffId } = req.params;
        
        if (!staffId) {
            return res.status(400).json({ success: false, message: 'Staff ID is required' });
        }
        
        const history = await StaffService.getSalaryHistory(staffId);
        return res.json({ success: true, data: history });
    } catch (err) {
        return res.status(500).json({ success: false, message: (err as Error).message });
    }
}

async function getAuditLogs(req: Request, res: Response) {
    try {
        const { userId, action, entity, startDate, endDate, limit } = req.query;
        
        const filters: any = {};
        if (userId) filters.userId = userId;
        if (action) filters.action = action;
        if (entity) filters.entity = entity;
        if (startDate) filters.startDate = new Date(startDate as string);
        if (endDate) filters.endDate = new Date(endDate as string);
        if (limit) filters.limit = Number(limit);
        
        const logs = await AuditService.getLogs(filters);
        return res.json({ success: true, data: logs });
    } catch (err) {
        return res.status(500).json({ success: false, message: (err as Error).message });
    }
}

export default {
    getDashboardAnalytics,
    getSalaryHistory,
    getAuditLogs,
};
