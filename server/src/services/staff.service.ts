import mongoose, { Types } from 'mongoose';
import StaffModel from '../models/staff.model.js';
import type IStaff from '../types/staff.type.js';

async function getAllStaffsFromDB() {
    const staffs = await StaffModel.aggregate([
        {
            $lookup: {
                from: 'user',
                let: { userId: '$userId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', { $toObjectId: '$$userId' }],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            emailVerified: 1,
                            image: 1,
                            role: 1,
                            theme: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                ],
                as: 'user',
            },
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'branches',
                localField: 'branchId',
                foreignField: '_id',
                as: 'branch',
            },
        },
        {
            $unwind: {
                path: '$branch',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $sort: { createdAt: -1 },
        },
    ]);

    return staffs;
}

async function getStaffFromDB(userId: string) {
    return StaffModel.findOne({ userId }).lean();
}

async function createStaffInDB(payload: { staff: Partial<IStaff> }) {
    const { staff } = payload;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const exists = await StaffModel.findOne({
            staffId: staff.staffId as string,
        }).session(session);

        if (exists) throw new Error('Staff with this ID already exists.');

        const newStaff = await StaffModel.create(
            [
                {
                    staffId: staff.staffId as string,
                    branchId: new Types.ObjectId(staff.branchId),
                    department: staff.department as string,
                    designation: staff.designation as string,
                    joinDate: staff.joinDate as Date,
                    status: 'active',
                    profileCompleted: false,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        return newStaff[0];
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}

async function completeProfileInDB(payload: {
    userId: string;
    staff: Partial<IStaff>;
}) {
    const { userId, staff } = payload;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingStaff = await StaffModel.findOne({ userId }).session(
            session
        );

        if (!existingStaff) throw new Error('Staff not found.');

        if (existingStaff.profileCompleted)
            throw new Error('Profile already completed.');

        existingStaff.set({
            ...staff,
            profileCompleted: true,
        });

        const result = await existingStaff.save({ session });

        await session.commitTransaction();
        return result;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}

async function updateProfileInDB(payload: {
    userId: string;
    fields: Partial<IStaff>;
}) {
    const { userId, fields } = payload;

    const updated = await StaffModel.findOneAndUpdate(
        { userId, profileCompleted: true },
        { $set: fields },
        { new: true }
    );

    if (!updated) throw new Error('Profile not found or not completed yet.');

    return updated;
}

export default {
    getAllStaffsFromDB,
    getStaffFromDB,
    createStaffInDB,
    completeProfileInDB,
    updateProfileInDB,
};
