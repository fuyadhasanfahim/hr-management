import { Document, Types } from 'mongoose';

export interface IOvertime extends Document {
    staffId: Types.ObjectId;
    shiftId?: Types.ObjectId;
    date: Date;
    type: 'pre_shift' | 'post_shift' | 'weekend' | 'holiday';
    startTime: Date;
    endTime?: Date;
    durationMinutes: number;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
    createdBy?: Types.ObjectId;
    approvedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
