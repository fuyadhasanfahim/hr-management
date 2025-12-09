import type { Types } from 'mongoose';

export interface ILeaveApplication {
    staffId: Types.ObjectId;
    leaveType: 'annual' | 'sick' | 'paid' | 'casual' | 'earned' | 'other';
    startDate: Date;
    endDate: Date;
    requestedDates: Date[];
    approvedDates: Date[];
    rejectedDates: Date[];
    status:
        | 'pending'
        | 'approved'
        | 'partially_approved'
        | 'rejected'
        | 'cancelled';
    reason?: string;
    alternativeContact?: string;
    commentByApprover?: string;
    approvedBy?: Types.ObjectId;
    appliedBy: Types.ObjectId;
    isPaid?: boolean;
    affectsSalary?: boolean;
    attendanceLinked?: boolean;

    createdAt: Date;
    updatedAt: Date;
}
