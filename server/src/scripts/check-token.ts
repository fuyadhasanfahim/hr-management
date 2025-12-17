import mongoose from 'mongoose';
import InvitationModel from '../models/invitation.model.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const checkToken = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to DB');

        const token = '60e2ad6e171d3a9aee95be833fdd2ffba494a5e35d559661c07ae1ae5e5be340';
        const invitation = await InvitationModel.findOne({ token });

        if (!invitation) {
            console.log('Token NOT FOUND');
        } else {
            console.log('Token FOUND');
            console.log('Expires At:', invitation.expiresAt);
            console.log('Is Used:', invitation.isUsed);
            console.log('Is Expired:', invitation.expiresAt < new Date());
        }
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkToken();
