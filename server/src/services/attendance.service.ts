import { endOfDay, startOfDay } from 'date-fns';
import AttendanceEventModel from '../models/attendance-event.model.js';
import ShiftAssignmentModel from '../models/shift-assignment.model.js';
import AttendanceDayModel from '../models/attendance-day.model.js';
import type { IShift } from '../types/shift.type.js';
import StaffModel from '../models/staff.model.js';

const checkInInDB = async ({
    userId,
    ip,
    userAgent,
    source = 'web',
}: {
    userId: string;
    ip: string;
    userAgent: string;
    source?: 'web' | 'mobile' | 'manual';
}) => {
    const now = new Date();

    const dayStart = startOfDay(now);
    const dayEnd = endOfDay(now);

    const staff = await StaffModel.findOne({ userId }).lean();
    if (!staff) {
        throw new Error('Staff not found for the user.');
    }

    const staffId = staff._id;

    const lastEvent = await AttendanceEventModel.findOne({
        staffId,
        at: { $gte: dayStart, $lte: dayEnd },
    })
        .sort({ at: -1 })
        .lean();

    if (lastEvent?.type === 'check_in') {
        throw new Error('You are already checked in.');
    }

    const shiftAssignment = await ShiftAssignmentModel.findOne({
        staffId,
        startDate: { $lte: now },
        $or: [{ endDate: null }, { endDate: { $gte: now } }],
        isActive: true,
    })
        .populate('shiftId')
        .lean();

    if (!shiftAssignment || !shiftAssignment.shiftId) {
        throw new Error('No active shift assignment found.');
    }

    const shift = shiftAssignment.shiftId as unknown as IShift;

    const todayDay = now.getDay();
    if (!shift.workDays.includes(todayDay as any)) {
        throw new Error('Today is not a working day for your shift.');
    }

    const shiftStart = new Date(now);
    const [h, m] = shift.startTime.split(':');
    shiftStart.setHours(Number(h), Number(m), 0, 0);

    const shiftEnd = new Date(now);
    const [eh, em] = shift.endTime.split(':');
    shiftEnd.setHours(Number(eh), Number(em), 0, 0);

    if (now < shiftStart) {
        throw new Error(
            'Shift has not started yet. Early check-in is not allowed.'
        );
    }

    if (now > shiftEnd) {
        throw new Error('Shift time is over. You can no longer check in.');
    }

    const event = await AttendanceEventModel.create({
        staffId,
        shiftId: shift._id,
        type: 'check_in',
        at: now,
        source,
        ip,
        userAgent,
        isManual: false,
        remarks: null,
    });

    let attendanceDay = await AttendanceDayModel.findOne({
        staffId,
        date: dayStart,
    });

    if (!attendanceDay) {
        attendanceDay = new AttendanceDayModel({
            staffId,
            shiftId: shift._id,
            date: dayStart,
            status: 'present',
            checkInAt: now,
            totalMinutes: 0,
            lateMinutes: 0,
            earlyExitMinutes: 0,
            otMinutes: 0,
            isAutoAbsent: false,
            isManual: false,
            notes: null,
        });
    } else {
        attendanceDay.status = 'present';
        attendanceDay.shiftId = shift._id;
        if (!attendanceDay.checkInAt) {
            attendanceDay.checkInAt = now;
        }
    }

    const diffMinutes = Math.round(
        (now.getTime() - shiftStart.getTime()) / 60000
    );

    if (diffMinutes > 0) {
        attendanceDay.lateMinutes = diffMinutes;

        if (diffMinutes >= shift.halfDayAfterMinutes) {
            attendanceDay.status = 'half_day';
        } else if (diffMinutes >= shift.lateAfterMinutes) {
            attendanceDay.status = 'late';
        } else if (diffMinutes <= shift.gracePeriodMinutes) {
            attendanceDay.status = 'present';
            attendanceDay.lateMinutes = 0;
        }
    }

    await attendanceDay.save();

    return {
        event,
        attendanceDay,
        shift,
    };
};

export default {
    checkInInDB,
};
