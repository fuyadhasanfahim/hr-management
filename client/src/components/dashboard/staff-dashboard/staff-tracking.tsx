"use client"

import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, FileText, Timer, LogOut } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import {
    useCheckInMutation,
    useCheckOutMutation,
    useGetTodayAttendanceQuery,
} from '@/redux/features/attendance/attendanceApi';
import {
    useGetMyOvertimeQuery,
    useStartOvertimeMutation,
    useStopOvertimeMutation,
} from '@/redux/features/overtime/overtimeApi';
import { toast } from 'sonner';
import { format } from 'date-fns';

const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

export default function StaffTracking() {
    const { data: todaysData, isLoading: isLoadingToday } =
        useGetTodayAttendanceQuery({});
    const { data: myOvertimeData, isLoading: isLoadingOT } = useGetMyOvertimeQuery({});

    const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();
    const [checkOut, { isLoading: isCheckingOut }] = useCheckOutMutation();
    const [startOvertime, { isLoading: isStartingOT }] = useStartOvertimeMutation();
    const [stopOvertime, { isLoading: isStoppingOT }] = useStopOvertimeMutation();

    const activeOT = myOvertimeData?.find((ot: any) => !ot.endTime);

    // Check if any Post-Shift OT is completed for today
    const todayOT = myOvertimeData?.find((ot: any) => {
        const otDate = new Date(ot.date);
        const today = new Date();
        return (
            otDate.getDate() === today.getDate() &&
            otDate.getMonth() === today.getMonth() &&
            otDate.getFullYear() === today.getFullYear() &&
            ot.type === 'post_shift'
        );
    });

    const isOTCompletedToday = !!todayOT && !!todayOT.endTime;

    const handleCheckIn = async () => {
        try {
            const res = await checkIn({
                source: 'web',
            }).unwrap();

            if (!res.success) {
                toast.error(res.message || 'Failed to check in.');
                return;
            }

            toast.message('Checked in successfully!', {
                description: format(new Date(), 'hh:mm aa'),
            });
        } catch (error: any) {
            const apiMessage =
                error?.data?.message ||
                error?.error ||
                'Failed to check in. Please try again.';

            toast.error(apiMessage);
        }
    };

    const handleCheckOut = async () => {
        try {
            const res = await checkOut({
                source: 'web',
            }).unwrap();

            if (!res.success) {
                toast.error(res.message || 'Failed to check out.');
                return;
            }

            if (res.attendanceDay.earlyExitMinutes > 0) {
                toast.warning('Checked out early!', {
                    description: `You left ${res.attendanceDay.earlyExitMinutes} minutes early.`,
                });
            } else {
                toast.success('Checked out successfully!');
            }
        } catch (error: any) {
            console.log(error);
            const apiMessage =
                error?.data?.message ||
                error?.error ||
                'Failed to check out. Please try again.';

            toast.error(apiMessage);
        }
    };

    const handleStartOT = async () => {
        try {
            await startOvertime({}).unwrap();
            toast.success('Overtime started!');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to start overtime');
        }
    };

    const handleStopOT = async () => {
        try {
            await stopOvertime({}).unwrap();
            toast.success('Overtime stopped!');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to stop overtime');
        }
    };

    const handleApplyLeave = () => {
        alert('Leave application page coming soon!');
    };

    const attendanceDay = todaysData?.attendance?.attendanceDay;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-xl font-bold">
                        Time Tracking (Today)
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Date: {format(new Date(), 'PPP')}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4 flex flex-col gap-1">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Check-in</span>
                                <LogIn className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-2xl font-bold">
                                {attendanceDay?.checkInAt
                                    ? format(attendanceDay.checkInAt, 'hh:mm aa')
                                    : '...'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex flex-col gap-1">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Check-out</span>
                                <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-2xl font-bold">
                                {attendanceDay?.checkOutAt
                                    ? format(attendanceDay.checkOutAt, 'hh:mm aa')
                                    : '...'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex flex-col gap-1">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Worked</span>
                                <Timer className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-2xl font-bold">
                                {formatDuration(
                                    attendanceDay?.totalMinutes || 0
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex flex-col gap-1">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Overtime</span>
                                <Timer className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="text-2xl font-bold">
                                {formatDuration(attendanceDay?.otMinutes || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {!attendanceDay?.checkInAt ? (
                        <Button
                            size="lg"
                            className="flex-1 shadow-md"
                            onClick={handleCheckIn}
                            disabled={isCheckingIn}
                        >
                            {isCheckingIn ? (
                                <Spinner />
                            ) : (
                                <>
                                    <LogIn className="h-5 w-5" />
                                    Check In
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="flex-1 shadow-md"
                            onClick={handleCheckOut}
                            disabled={
                                isCheckingOut || !!attendanceDay?.checkOutAt
                            }
                        >
                            {isCheckingOut ? (
                                <Spinner />
                            ) : (
                                <>
                                    <LogOut className="h-5 w-5" />
                                    {attendanceDay?.checkOutAt
                                        ? 'Checked Out'
                                        : 'Check Out'}
                                </>
                            )}
                        </Button>
                    )}

                    {activeOT ? (
                        <Button
                            size="lg"
                            variant="destructive"
                            className="flex-1 shadow-md"
                            onClick={handleStopOT}
                            disabled={isStoppingOT}
                        >
                            {isStoppingOT ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Clock className="h-5 w-5" />
                                    Stop OT
                                </>
                            )}
                        </Button>
                    ) : isOTCompletedToday ? (
                        <Button
                            size="lg"
                            variant="secondary"
                            className="flex-1 shadow-md opacity-50 cursor-not-allowed"
                            disabled={true}
                        >
                            <Clock className="h-5 w-5" />
                            OT Completed
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            variant="secondary"
                            className="flex-1 shadow-md"
                            onClick={handleStartOT}
                            disabled={isStartingOT}
                        >
                            {isStartingOT ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Clock className="h-5 w-5" />
                                    Start OT
                                </>
                            )}
                        </Button>
                    )}

                    <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 shadow-md"
                        onClick={handleApplyLeave}
                    >
                        <FileText className="h-5 w-5" />
                        Apply for Leave
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
