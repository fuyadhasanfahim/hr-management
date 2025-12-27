export type EarningStatus = 'pending' | 'completed';

export interface IEarning {
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

export interface IOrderForWithdrawal {
    _id: string;
    orderName: string;
    totalPrice: number;
    deliveredAt: string;
}

export interface CreateEarningInput {
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

export interface UpdateEarningInput {
    totalOrderAmount?: number;
    fees?: number;
    tax?: number;
    currency?: string;
    conversionRate?: number;
    notes?: string;
}

export interface EarningFilters {
    page?: number;
    limit?: number;
    clientId?: string;
    month?: number;
    year?: number;
    status?: EarningStatus;
}

export interface EarningsResponse {
    message: string;
    data: IEarning[];
    meta: {
        total: number;
        page: number;
        totalPages: number;
    };
}

export interface EarningResponse {
    message: string;
    data: IEarning;
}

export interface OrdersForWithdrawalResponse {
    message: string;
    data: IOrderForWithdrawal[];
    totalAmount: number;
}

export interface EarningStats {
    totalEarnings: number;
    thisMonthEarnings: number;
    totalWithdrawals: number;
    thisMonthWithdrawals: number;
}

export interface EarningStatsResponse {
    message: string;
    data: EarningStats;
}

// Currency options
export const CURRENCIES = [
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
    { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
    { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
] as const;

export const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
};
