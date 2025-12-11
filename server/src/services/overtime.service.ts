import { Types } from 'mongoose';
import type { PipelineStage } from 'mongoose';
import OvertimeModel from '../models/overtime.model.js';
import type { IOvertime } from '../types/overtime.type.js';
import StaffModel from '../models/staff.model.js';

const getOvertimeAggregationPipeline = (matchStage: any): PipelineStage[] => [
    { $match: matchStage },
    // Lookup Staff
    {
        $lookup: {
            from: 'staffs',
            localField: 'staffId',
            foreignField: '_id',
            as: 'staffId',
        },
    },
    { $unwind: { path: '$staffId', preserveNullAndEmptyArrays: true } },
    // Lookup Staff User (for name & photo)
    {
        $lookup: {
            from: 'user',
            localField: 'staffId.userId',
            foreignField: '_id',
            as: 'staffUser',
        },
    },
    { $unwind: { path: '$staffUser', preserveNullAndEmptyArrays: true } },
    // Enrich Staff Object
    {
        $addFields: {
            'staffId.name': '$staffUser.name',
            'staffId.photo': '$staffUser.image',
        },
    },
    // Lookup CreatedBy
    {
        $lookup: {
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
        },
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    // Lookup ApprovedBy
    {
        $lookup: {
            from: 'user',
            localField: 'approvedBy',
            foreignField: '_id',
            as: 'approvedBy',
        },
    },
    { $unwind: { path: '$approvedBy', preserveNullAndEmptyArrays: true } },
    // Sort
    { $sort: { date: -1 } },
    // Cleanup
    {
        $project: {
            staffUser: 0,
            'createdBy.password': 0,
            'approvedBy.password': 0,
            'staffId.userId': 0, // optional cleanup
        },
    },
];

const createOvertimeInDB = async (
    payload: Partial<IOvertime> & { createdBy: string }
) => {
    const result = await OvertimeModel.create({
        ...payload,
        status: 'approved',
        approvedBy: payload.createdBy, // Auto-approve by creator
    });
    return result;
};

const getAllOvertimeFromDB = async (query: Record<string, unknown>) => {
    // Basic query filtering if needed, for now we just match everything or specific fields
    const matchStage: any = {};
    if (query.status) matchStage.status = query.status;
    // Add other filters as needed based on query params

    const result = await OvertimeModel.aggregate(
        getOvertimeAggregationPipeline(matchStage)
    );
    return result;
};

const getOvertimeByIdFromDB = async (id: string) => {
    const result = await OvertimeModel.aggregate(
        getOvertimeAggregationPipeline({ _id: new Types.ObjectId(id) })
    );
    return result[0] || null;
};

const updateOvertimeInDB = async (id: string, payload: Partial<IOvertime>) => {
    const result = await OvertimeModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};

const deleteOvertimeFromDB = async (id: string) => {
    const result = await OvertimeModel.findByIdAndDelete(id);
    return result;
};

const getStaffOvertimeFromDB = async (userId: string) => {
    const staff = await StaffModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!staff) {
        throw new Error('Staff record not found');
    }
    const result = await OvertimeModel.aggregate(
        getOvertimeAggregationPipeline({ staffId: staff._id })
    );
    return result;
};

const startOvertimeInDB = async (userId: string) => {
    const staff = await StaffModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!staff) throw new Error('Staff record not found');

    // Check for any overtime today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingOvertime = await OvertimeModel.findOne({
        staffId: staff._id,
        date: {
            $gte: startOfDay,
            $lte: endOfDay,
        },
        type: 'post_shift', // Only restrict multiple 'post_shift' sessions
    });

    if (existingOvertime) {
        throw new Error('You have already recorded post-shift overtime for today');
    }

    const result = await OvertimeModel.create({
        staffId: staff._id,
        date: new Date(),
        startTime: new Date(),
        type: 'post_shift', 
        status: 'pending',
        createdBy: userId,
    });

    return result;
};

const stopOvertimeInDB = async (userId: string) => {
    const staff = await StaffModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!staff) throw new Error('Staff record not found');

    const activeOvertime = await OvertimeModel.findOne({
        staffId: staff._id,
        endTime: { $exists: false },
    });

    if (!activeOvertime) {
        throw new Error('No active overtime session found');
    }

    const endTime = new Date();
    const durationMs = endTime.getTime() - new Date(activeOvertime.startTime).getTime();
    const durationMinutes = Math.floor(durationMs / 1000 / 60);

    activeOvertime.endTime = endTime;
    activeOvertime.durationMinutes = durationMinutes;
    // Status remains pending until approved? Or auto-approved?
    // Maintaining 'pending' as per original plan unless specified otherwise.
    await activeOvertime.save();

    return activeOvertime;
};

export default {
    createOvertimeInDB,
    getAllOvertimeFromDB,
    getOvertimeByIdFromDB,
    updateOvertimeInDB,
    deleteOvertimeFromDB,
    getStaffOvertimeFromDB,
    startOvertimeInDB,
    stopOvertimeInDB,
};
