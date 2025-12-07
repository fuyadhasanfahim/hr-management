'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useUpdateShiftMutation } from '@/redux/features/shift/shiftApi';
import { useGetAllBranchesQuery } from '@/redux/features/branch/branchApi';
import { Spinner } from '../ui/spinner';

interface UpdateShiftProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    shift: any;
}

export default function UpdateShift({
    open,
    setOpen,
    shift,
}: UpdateShiftProps) {
    const { data: branchData } = useGetAllBranchesQuery(undefined);

    const [updateShift, { isLoading }] = useUpdateShiftMutation();

    const [form, setForm] = useState({
        name: '',
        code: '',
        startTime: '',
        endTime: '',
        otEnabled: false,
        branch: '',
    });

    useEffect(() => {
        if (shift) {
            setForm({
                name: shift.name,
                code: shift.code,
                startTime: shift.startTime,
                endTime: shift.endTime,
                otEnabled: shift.otEnabled,
                branch: shift.branch,
            });
        }
    }, [shift]);

    const handleUpdate = async () => {
        try {
            if (
                !form.name ||
                !form.code ||
                !form.startTime ||
                !form.endTime ||
                !form.branch
            ) {
                toast.error('All fields are required');
                return;
            }

            await updateShift({
                id: shift._id,
                data: {
                    ...form,
                    code: form.code.toUpperCase(),
                },
            }).unwrap();

            toast.success('Shift updated successfully');
            setOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || 'Update failed');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Shift</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Shift Name *</Label>
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Code *</Label>
                        <Input
                            value={form.code}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    code: e.target.value.toUpperCase(),
                                })
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Branch *</Label>
                        <Select
                            value={form.branch}
                            onValueChange={(v) =>
                                setForm({ ...form, branch: v })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select branch" />
                            </SelectTrigger>

                            <SelectContent>
                                {branchData?.branches?.map((b: any) => (
                                    <SelectItem key={b._id} value={b._id}>
                                        {b.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Start Time *</Label>
                            <Input
                                type="time"
                                value={form.startTime}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        startTime: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>End Time *</Label>
                            <Input
                                type="time"
                                value={form.endTime}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        endTime: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label>OT Enabled</Label>
                        <Switch
                            checked={form.otEnabled}
                            onCheckedChange={(v) =>
                                setForm({ ...form, otEnabled: v })
                            }
                        />
                    </div>

                    <Button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? <Spinner /> : 'Update Shift'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
