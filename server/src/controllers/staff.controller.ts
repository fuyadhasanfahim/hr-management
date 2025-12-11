import type { Request, Response } from 'express';
import StaffServices from '../services/staff.service.js';

const getStaffs = async (_req: Request, res: Response) => {
    try {

        const staffs = await StaffServices.getAllStaffsFromDB();

        return res.json({ success: true, staffs });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, message: (err as Error).message });
    }
};

async function getStaff(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res
                .status(401)
                .json({ success: false, message: 'Unauthorized' });

        const staff = await StaffServices.getStaffFromDB(userId);

        if (!staff)
            return res
                .status(404)
                .json({ success: false, message: 'No staff profile found.' });

        return res.json({ success: true, staff });
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, message: (err as Error).message });
    }
}

async function createStaff(req: Request, res: Response) {
    try {
        const result = await StaffServices.createStaffInDB({ staff: req.body });

        return res.status(201).json({ success: true, staff: result });
    } catch (err) {
        return res
            .status(400)
            .json({ success: false, message: (err as Error).message });
    }
}

async function completeProfile(req: Request, res: Response) {
    try {
        const result = await StaffServices.completeProfileInDB({
            userId: req.user!.id,
            staff: req.body,
        });

        return res.status(200).json({ success: true, staff: result });
    } catch (err) {
        return res
            .status(400)
            .json({ success: false, message: (err as Error).message });
    }
}

async function updateProfile(req: Request, res: Response) {
    try {
        const result = await StaffServices.updateProfileInDB({
            userId: req.user!.id,
            fields: req.body,
        });

        return res.status(200).json({ success: true, staff: result });
    } catch (err) {
        return res
            .status(400)
            .json({ success: false, message: (err as Error).message });
    }
}

export default {
    getStaffs,
    getStaff,
    createStaff,
    completeProfile,
    updateProfile,
};
