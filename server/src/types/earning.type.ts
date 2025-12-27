import { Document, Types } from 'mongoose';

export type EarningStatus = 'pending' | 'completed';

export interface IEarning extends Document {
    clientId: Types.ObjectId;
    orderIds: Types.ObjectId[];
    month: number; // 1-12
    year: number;
    totalOrderAmount: number; // Sum of order totals
    fees: number; // Platform fees
    tax: number; // Tax amount
    netAmount: number; // After fees/tax
    currency: string; // Original currency (USD, EUR, etc.)
    conversionRate: number; // Rate to BDT
    amountInBDT: number; // Final amount in BDT
    notes?: string;
    status: EarningStatus;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEarningPopulated {
    _id: string;
    clientId: {
        _id: string;
        clientId: string;
        name: string;
        email: string;
    };
    orderIds: {
        _id: string;
        orderName: string;
        totalPrice: number;
    }[];
    month: number;
    year: number;
    totalOrderAmount: number;
    fees: number;
    tax: number;
    netAmount: number;
    currency: string;
    conversionRate: number;
    amountInBDT: number;
    notes?: string;
    status: EarningStatus;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEarningData {
    clientId: string;
    orderIds: string[];
    month: number;
    year: number;
    totalOrderAmount: number;
    fees: number;
    tax: number;
    currency: string;
    conversionRate: number;
    notes?: string;
}

export interface EarningQueryParams {
    page?: number;
    limit?: number;
    clientId?: string;
    month?: number;
    year?: number;
    status?: EarningStatus;
}
