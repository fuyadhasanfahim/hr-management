import { Router } from 'express';
import AttendanceController from '../controllers/attendance.controller.js';

const router: Router = Router();

router.post('/check-in', AttendanceController.checkIn);
router.post('/check-out', AttendanceController.checkOut);

router.get('/today', AttendanceController.getTodayAttendance);
router.get('/monthly-stats', AttendanceController.getMonthlyStats);
router.get('/my-history', AttendanceController.getMyAttendanceHistory);

export const attendanceRoute = router;
