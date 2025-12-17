import StaffModel from '../models/staff.model.js';
import { client } from '../lib/db.js';
import envConfig from '../config/env.config.js';

async function getDashboardAnalytics() {
    const mongoClient = await client();
    const db = mongoClient.db(envConfig.db_name);
    
    // Total stats
    const totalStaff = await StaffModel.countDocuments({ status: 'active' });
    const totalDepartments = await StaffModel.distinct('department').then(d => d.length);
    
    // Salary analytics
    const salaryStats = await StaffModel.aggregate([
        { $match: { status: 'active' } },
        {
            $group: {
                _id: null,
                avgSalary: { $avg: '$salary' },
                minSalary: { $min: '$salary' },
                maxSalary: { $max: '$salary' },
                totalSalary: { $sum: '$salary' },
            }
        }
    ]);
    
    // Department-wise count
    const departmentStats = await StaffModel.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    
    // Role distribution
    const roleStats = await db.collection('user').aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
    ]).toArray();
    
    return {
        totalStaff,
        totalDepartments,
        salary: salaryStats[0] || {},
        departments: departmentStats,
        roles: roleStats,
    };
}

export default {
    getDashboardAnalytics,
};
