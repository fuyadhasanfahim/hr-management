import { Role } from '../consonants/role.js';
import ShiftModel from '../models/shift.model.js';
import StaffModel from '../models/staff.model.js';
import type { IShift } from '../types/shift.type.js';

const createShift = async (payload: any, userId: string, userRole: string) => {
    let branchId: any = null;

    if (userRole === Role.SUPER_ADMIN) {
        branchId = payload.branch;
        if (!branchId) {
            throw new Error('Branch is required for super admin');
        }
    } else {
        const staff = await StaffModel.findOne({ userId }).select('branch');

        if (!staff?.branch) {
            throw new Error('Branch not found for this user');
        }

        branchId = staff.branch;
    }

    const isExist = await ShiftModel.findOne({
        code: payload.code,
        branch: branchId,
    });

    if (isExist) {
        throw new Error('Shift code already exists in this branch');
    }

    const shift = await ShiftModel.create({
        ...payload,
        branch: branchId,
        createdBy: userId,
    });

    return shift;
};

const getAllShifts = async (userId: string, userRole: string) => {
    if (userRole === Role.SUPER_ADMIN) {
        return await ShiftModel.find().sort({
            createdAt: -1,
        });
    }

    const staff = await StaffModel.findOne({ userId }).select('branch');

    if (!staff?.branch) {
        throw new Error('Branch not found for this user');
    }

    return await ShiftModel.find({
        branch: staff.branch,
    }).sort({ createdAt: -1 });
};

const updateShift = async (
    id: string,
    payload: Partial<IShift>,
    userId: string,
    userRole: string
) => {
    let query: any = { _id: id };

    if (userRole !== Role.SUPER_ADMIN) {
        const staff = await StaffModel.findOne({ userId }).select('branch');

        if (!staff?.branch) {
            throw new Error('Branch not found for this user');
        }

        query.branch = staff.branch;
    }

    const shift = await ShiftModel.findOneAndUpdate(query, payload, {
        new: true,
        runValidators: true,
    });

    if (!shift) {
        throw new Error('Shift not found or not in your branch');
    }

    return shift;
};

const deleteShift = async (id: string, userId: string, userRole: string) => {
    let query: any = { _id: id };

    if (userRole !== Role.SUPER_ADMIN) {
        const staff = await StaffModel.findOne({ userId }).select('branch');

        if (!staff?.branch) {
            throw new Error('Branch not found for this user');
        }

        query.branch = staff.branch;
    }

    const shift = await ShiftModel.findOneAndDelete(query);

    if (!shift) {
        throw new Error('Shift not found or not in your branch');
    }

    return true;
};

const ShiftServices = {
    createShift,
    getAllShifts,
    updateShift,
    deleteShift,
};

export default ShiftServices;
