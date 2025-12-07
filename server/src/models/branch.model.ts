import { model, Schema } from 'mongoose';

const branchSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            unique: true,
        },

        address: {
            type: String,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const BranchModel = model('Branch', branchSchema);
export default BranchModel;
