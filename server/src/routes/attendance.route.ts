import { Router } from 'express';
import AttendanceController from '../controllers/attendance.controller.js';

const router: Router = Router();

router.post('/check-in', AttendanceController.checkIn);

export const attendanceRoute = router;
