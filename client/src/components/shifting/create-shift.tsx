'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Role } from '@/consonants/role';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Loader, Plus } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useCreateShiftMutation } from '@/redux/features/shift/shiftApi';
import { useGetAllBranchesQuery } from '@/redux/features/branch/branchApi';
import { Spinner } from '../ui/spinner';

export default function CreateShift() {
    const { data: session, isPending, isRefetching } = useSession();

    const { data: branchData, isLoading: isBranchLoading } =
        useGetAllBranchesQuery(undefined);

    const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        name: '',
        code: '',
        startTime: '10:00:00',
        endTime: '18:00:00',
        otEnabled: false,
        branch: '',
    });

    const isLoading =
        isPending || isRefetching || isCreating || isBranchLoading;

    const canCreate =
        session &&
        session.user.role !== Role.TEAM_LEADER

    const handleCreate = async () => {
        try {
            if (
                !form.name.trim() ||
                !form.code.trim() ||
                !form.startTime ||
                !form.endTime ||
                !form.branch
            ) {
                toast.error('All fields are required');
                return;
            }

            if (form.startTime >= form.endTime) {
                toast.error('End time must be after start time');
                return;
            }

            await createShift({
                ...form,
                code: form.code.toUpperCase(),
            }).unwrap();

            toast.success('Shift created successfully');

            setForm({
                name: '',
                code: '',
                startTime: '',
                endTime: '',
                otEnabled: false,
                branch: '',
            });

            setOpen(false);
        } catch (err: any) {
            toast.error(
                err?.data?.message || err?.message || 'Failed to create shift'
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={isLoading || !canCreate}>
                    <Plus />
                    New Shift
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Shift</DialogTitle>
                    <DialogDescription>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Culpa, tempore.
                    </DialogDescription>
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
                            placeholder="Morning Shift"
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
                            placeholder="M1"
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
                                {branchData?.branches?.map((branch: any) => (
                                    <SelectItem
                                        key={branch._id}
                                        value={branch._id}
                                    >
                                        {branch.name}
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
                                step="1"
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                                step="1"
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                        onClick={handleCreate}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? <Spinner /> : 'Create Shift'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
