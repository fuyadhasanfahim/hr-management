'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

import { EllipsisVertical, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { useUpdateShiftMutation } from '@/redux/features/shift/shiftApi';
import UpdateShift from './update-shift';
import { IShift } from '@/types/shift.type';
import { useSession } from '@/lib/auth-client';
import { Role } from '@/consonants/role';
import ShiftDeleteAlert from './shift-delete-alert';

interface ShiftCardProps {
    shift: IShift;
}

export default function ShiftCard({ shift }: ShiftCardProps) {
    const { data: session, isPending, isRefetching } = useSession();

    const [openEdit, setOpenEdit] = useState(false);

    const [updateShift, { isLoading: isUpdating }] = useUpdateShiftMutation();

    const isLoading = isPending || isRefetching;

    const handleToggleStatus = async (value: boolean) => {
        try {
            await updateShift({
                id: shift._id,
                data: { isActive: value },
            }).unwrap();

            toast.success('Shift status updated');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update status');
        }
    };

    return (
        <>
            <Card className="relative">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="truncate text-lg font-semibold">
                            {shift.name}
                        </CardTitle>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{shift.code}</Badge>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        disabled={
                                            isLoading ||
                                            session?.user.role ===
                                                Role.TEAM_LEADER
                                        }
                                    >
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => setOpenEdit(true)}
                                    >
                                        <Pencil />
                                        Edit
                                    </DropdownMenuItem>

                                    <ShiftDeleteAlert shiftId={shift._id} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Start</span>
                        <span>{shift.startTime}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>End</span>
                        <span>{shift.endTime}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>OT</span>
                        <span>{shift.otEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Status</span>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    shift.isActive ? 'default' : 'secondary'
                                }
                            >
                                {shift.isActive ? 'Active' : 'Inactive'}
                            </Badge>

                            <Switch
                                checked={shift.isActive}
                                disabled={isUpdating}
                                onCheckedChange={handleToggleStatus}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <UpdateShift open={openEdit} setOpen={setOpenEdit} shift={shift} />
        </>
    );
}
