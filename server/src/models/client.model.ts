import { model, Schema } from 'mongoose';
import type { IClient } from '../types/client.type.js';

const ClientSchema = new Schema<IClient>(
    {
        clientId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        officeAddress: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        currency: {
            type: String,
            trim: true,
            uppercase: true, // Store as uppercase (USD, EUR, etc.)
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
            index: true,
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

// Compound index for search
ClientSchema.index({ name: 'text', email: 'text' });

const ClientModel = model<IClient>('Client', ClientSchema);
export default ClientModel;
