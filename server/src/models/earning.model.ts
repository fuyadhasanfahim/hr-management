import { model, Schema } from 'mongoose';
import type { IEarning } from '../types/earning.type.js';

const EarningSchema = new Schema<IEarning>(
    {
        clientId: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
            index: true,
        },
        orderIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Order',
            },
        ],
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        year: {
            type: Number,
            required: true,
        },
        totalOrderAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        fees: {
            type: Number,
            required: true,
            default: 0,
        },
        tax: {
            type: Number,
            required: true,
            default: 0,
        },
        netAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        currency: {
            type: String,
            required: true,
            uppercase: true,
        },
        conversionRate: {
            type: Number,
            required: true,
            default: 1,
        },
        amountInBDT: {
            type: Number,
            required: true,
            default: 0,
        },
        notes: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'completed',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for client + month + year
EarningSchema.index({ clientId: 1, month: 1, year: 1 });

const EarningModel = model<IEarning>('Earning', EarningSchema);
export default EarningModel;
