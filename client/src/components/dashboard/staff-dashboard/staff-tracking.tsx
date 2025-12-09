import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, FileText, Timer } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useCheckInMutation } from '@/redux/features/attendance/attendanceApi';
import { toast } from 'sonner';

const mockAttendance = {
    today: {
        date: 'December 8, 2025',
        checkIn: '09:05 AM',
        checkOut: '...',
        worked: '06h 30m',
        overtime: '01h 15m',
    },
};

export default function StaffTracking() {
    const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();
    const [isStartingOT, setIsStartingOT] = useState(false);

    const handleCheckIn = async () => {
        try {
            const res = await checkIn({
                source: 'web',
            }).unwrap();

            if (!res.success) {
                toast.error(res.message || 'Failed to check in.');
                return;
            }

            toast.success('Checked in successfully!');
        } catch (error: any) {
            const apiMessage =
                error?.data?.message ||
                error?.error ||
                'Failed to check in. Please try again.';

            toast.error(apiMessage);
        }
    };

    const handleStartOT = () => {
        setIsStartingOT(true);
        setTimeout(() => {
            setIsStartingOT(false);
            alert('Overtime started!');
        }, 1500);
    };

    const handleApplyLeave = () => {
        alert('Leave application page coming soon!');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-xl font-bold">
                        Time Tracking (Today)
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Date: {mockAttendance.today.date}
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
                                {mockAttendance.today.checkIn}
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
                                {mockAttendance.today.checkOut}
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
                                {mockAttendance.today.worked}
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
                                {mockAttendance.today.overtime}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
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
