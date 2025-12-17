import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import StaffModel from '../models/staff.model.js';
import AttendanceDayModel from '../models/attendance-day.model.js';
import OvertimeModel from '../models/overtime.model.js';
import { client } from '../lib/db.js';
import { Role } from '../consonants/role.js';
import envConfig from '../config/env.config.js';
import type {
    IDashboardStats,
    IStaffStats,
    IAttendanceOverview,
    IMonthlyAttendanceStats,
    IOvertimeSummary,
    IRecentActivity,
} from '../types/dashboard.type.js';

const getStaffStats = async (): Promise<IStaffStats> => {
    // Get database instance
    const mongoClient = await client();
    const db = mongoClient.db(envConfig.db_name);
    
    // Find only staff and team_leader users (exclude admins)
    const staffUsers = await db.collection('user').find({
        role: { $in: [Role.STAFF, Role.TEAM_LEADER] }
    }).toArray();
    
    const staffUserIds = staffUsers.map((u: any) => u._id);
    
    // Count only staff records for actual staff users
    const total = await StaffModel.countDocuments({
        userId: { $in: staffUserIds }
    });
    
    const active = await StaffModel.countDocuments({
        userId: { $in: staffUserIds },
        status: 'active'
    });
    
    const inactive = total - active;

    // Get staff count by department (only for actual staff)
    const byDepartment = await StaffModel.aggregate([
        {
            $match: {
                userId: { $in: staffUserIds }
            }
        },
        {
            $group: {
                _id: '$department',
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                department: '$_id',
                count: 1,
            },
        },
        {
            $sort: { count: -1 },
        },
    ]);

    return {
        total,
        active,
        inactive,
        byDepartment,
    };
};

const getTodayAttendanceOverview = async (): Promise<IAttendanceOverview> => {
    const today = new Date();
    const startDate = startOfDay(today);
    const endDate = endOfDay(today);

    const attendanceRecords = await AttendanceDayModel.find({
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    });

    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(
        (r) => r.status === 'present' || r.status === 'late'
    ).length;
    const absent = attendanceRecords.filter((r) => r.status === 'absent')
        .length;
    const late = attendanceRecords.filter((r) => r.status === 'late').length;
    const onLeave = attendanceRecords.filter((r) => r.status === 'on_leave')
        .length;

    const presentPercentage = total > 0 ? (present / total) * 100 : 0;

    return {
        date: today,
        total,
        present,
        absent,
        late,
        onLeave,
        presentPercentage: Math.round(presentPercentage * 100) / 100,
    };
};

const getMonthlyAttendanceStats =
    async (): Promise<IMonthlyAttendanceStats> => {
        const now = new Date();
        const startDate = startOfMonth(now);
        const endDate = endOfMonth(now);

        const attendanceRecords = await AttendanceDayModel.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        const totalWorkingDays = attendanceRecords.length;
        const totalPresent = attendanceRecords.filter(
            (r) => r.status === 'present' || r.status === 'late'
        ).length;
        const totalAbsent = attendanceRecords.filter(
            (r) => r.status === 'absent'
        ).length;
        const totalLate = attendanceRecords.filter(
            (r) => r.status === 'late'
        ).length;

        const averageAttendance =
            totalWorkingDays > 0 ? (totalPresent / totalWorkingDays) * 100 : 0;

        return {
            month: now.toLocaleString('default', { month: 'long' }),
            year: now.getFullYear(),
            totalWorkingDays,
            totalPresent,
            totalAbsent,
            totalLate,
            averageAttendance: Math.round(averageAttendance * 100) / 100,
        };
    };

const getOvertimeSummary = async (): Promise<IOvertimeSummary> => {
    const overtimeRecords = await OvertimeModel.find();

    const total = overtimeRecords.length;
    const pending = overtimeRecords.filter((r) => r.status === 'pending')
        .length;
    const approved = overtimeRecords.filter((r) => r.status === 'approved')
        .length;
    const rejected = overtimeRecords.filter((r) => r.status === 'rejected')
        .length;
    
    // Completed is not a valid status in IOvertime, so we'll count approved as completed
    const completed = approved;

    const totalMinutes = overtimeRecords.reduce(
        (sum, r) => sum + (r.durationMinutes || 0),
        0
    );
    const totalHours = Math.round((totalMinutes / 60) * 100) / 100;

    // Calculate total amount based on duration and assumed rate
    // Note: Amount is not in IOvertime, so we'll calculate it
    const totalAmount = 0; // Will need to calculate based on staff rates

    return {
        total,
        pending,
        approved,
        rejected,
        completed,
        totalHours,
        totalAmount: Math.round(totalAmount * 100) / 100,
    };
};

const getRecentActivities = async (): Promise<IRecentActivity[]> => {
    try {
        // Get recent attendance events
        const recentAttendance = await AttendanceDayModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('staffId', 'name email');

        // Get recent overtime records
        const recentOvertime = await OvertimeModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('staffId', 'name email');

        // Combine and format activities
        const activities: IRecentActivity[] = [];

        recentAttendance.forEach((record: any) => {
            if (record.staffId && record.staffId.name && record.staffId.email) {
                activities.push({
                    _id: record._id,
                    type: 'attendance',
                    action: `Marked ${record.status}`,
                    description: `${record.staffId.name} marked ${record.status}`,
                    user: {
                        _id: record.staffId._id,
                        name: record.staffId.name,
                        email: record.staffId.email,
                    },
                    timestamp: record.createdAt,
                });
            }
        });

        recentOvertime.forEach((record: any) => {
            if (record.staffId && record.staffId.name && record.staffId.email) {
                activities.push({
                    _id: record._id,
                    type: 'overtime',
                    action: `Overtime ${record.status}`,
                    description: `${record.staffId.name} overtime ${record.status}`,
                    user: {
                        _id: record.staffId._id,
                        name: record.staffId.name,
                        email: record.staffId.email,
                    },
                    timestamp: record.createdAt,
                });
            }
        });

        // Sort by timestamp and return top 10
        return activities
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        return [];
    }
};

const getAdminDashboardStats = async (): Promise<IDashboardStats> => {
    const [
        staffStats,
        attendanceOverview,
        monthlyAttendanceStats,
        overtimeSummary,
        recentActivities,
    ] = await Promise.all([
        getStaffStats(),
        getTodayAttendanceOverview(),
        getMonthlyAttendanceStats(),
        getOvertimeSummary(),
        getRecentActivities(),
    ]);

    return {
        staffStats,
        attendanceOverview,
        monthlyAttendanceStats,
        overtimeSummary,
        recentActivities,
    };
};

export default {
    getAdminDashboardStats,
    getStaffStats,
    getTodayAttendanceOverview,
    getMonthlyAttendanceStats,
    getOvertimeSummary,
    getRecentActivities,
};
