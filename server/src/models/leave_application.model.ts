import { model, Schema } from 'mongoose';
import type { ILeaveApplication } from '../types/leave_application.type.js';

const leaveApplicationSchema = new Schema<ILeaveApplication>(
    {
        staffId: {
            type: Schema.Types.ObjectId,
            ref: 'Staff',
            required: true,
            index: true,
        },

        leaveType: {
            type: String,
            enum: ['annual', 'sick', 'paid', 'casual', 'earned', 'other'],
            required: true,
            index: true,
        },

        startDate: {
            type: Date,
            required: true,
            index: true,
        },

        endDate: {
            type: Date,
            required: true,
            index: true,
        },

        requestedDates: {
            type: [Date],
            required: true,
        },

        approvedDates: {
            type: [Date],
            default: [],
        },

        rejectedDates: {
            type: [Date],
            default: [],
        },

        status: {
            type: String,
            enum: [
                'pending',
                'approved',
                'partially_approved',
                'rejected',
                'cancelled',
            ],
            default: 'pending',
            index: true,
        },

        reason: {
            type: String,
            required: true,
        },

        commentByApprover: { type: String },

        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        appliedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        isPaid: { type: Boolean, default: true },
        affectsSalary: { type: Boolean, default: true },

        attendanceLinked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

leaveApplicationSchema.index({ staffId: 1, startDate: 1, endDate: 1 });
leaveApplicationSchema.index({ staffId: 1, status: 1 });

const LeaveApplicationModel = model<ILeaveApplication>(
    'LeaveApplication',
    leaveApplicationSchema
);
export default LeaveApplicationModel;
