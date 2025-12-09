import { Types } from 'mongoose';
import StaffModel from '../models/staff.model.js';
import ShiftModel from '../models/shift.model.js';
import ShiftAssignmentModel from '../models/shift-assignment.model.js';

const assignShift = async ({
    staffIds,
    shiftId,
    startDate,
    assignedBy,
}: {
    staffIds: string[];
    shiftId: string;
    startDate: string;
    assignedBy: string;
}) => {
    const staffs = await StaffModel.find({ _id: { $in: staffIds } }).lean();
    if (staffs.length !== staffIds.length) {
        throw new Error('One or more staff IDs are invalid');
    }

    const shift = await ShiftModel.findById(shiftId).lean();
    if (!shift || !shift.isActive) {
        throw new Error('Invalid or inactive Shift');
    }

    const results: any[] = [];
    const errors: any[] = [];

    for (const staffId of staffIds) {
        try {
            const start = new Date(startDate);

            const existing = await ShiftAssignmentModel.findOne({
                staffId: new Types.ObjectId(staffId),
                isActive: true,
            });

            if (existing) {
                const end = new Date(start);
                end.setDate(end.getDate() - 1);

                existing.endDate = end;
                existing.isActive = false;
                await existing.save();
            }

            const newAssignment = await ShiftAssignmentModel.create({
                staffId: new Types.ObjectId(staffId),
                shiftId: new Types.ObjectId(shiftId),
                startDate: start,
                endDate: null,
                assignedBy: new Types.ObjectId(assignedBy),
                isActive: true,
            });

            results.push({
                staffId,
                assignmentId: newAssignment._id,
                success: true,
            });
        } catch (error: any) {
            errors.push({
                staffId,
                error: error.message,
                success: false,
            });
        }
    }

    return {
        successCount: results.length,
        failureCount: errors.length,
        results,
        errors,
    };
};

const shiftAssignmentService = {
    assignShift,
};
export default shiftAssignmentService;
