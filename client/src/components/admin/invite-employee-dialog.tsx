'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateInvitationMutation } from '@/redux/features/invitation/invitationApi';
import { useGetAllBranchesQuery } from '@/redux/features/branch/branchApi';
import { useGetAllShiftsQuery } from '@/redux/features/shift/shiftApi';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function InviteEmployeeDialog() {
    const [open, setOpen] = useState(false);
    const [createInvitation, { isLoading }] = useCreateInvitationMutation();
    const { data: branchesData } = useGetAllBranchesQuery(undefined);
    const { data: shiftsData } = useGetAllShiftsQuery(undefined);

    const [formData, setFormData] = useState({
        email: '',
        salary: '',
        role: 'staff' as 'staff' | 'team_leader',
        department: '',
        designation: '',
        branchId: '',
        shiftId: '',
        expiryHours: '48',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createInvitation({
                email: formData.email,
                salary: Number(formData.salary),
                role: formData.role,
                department: formData.department || undefined,
                designation: formData.designation,
                branchId: formData.branchId,
                shiftId: formData.shiftId === 'unassigned' ? undefined : (formData.shiftId || undefined),
                expiryHours: Number(formData.expiryHours),
            }).unwrap();

            toast.success('Invitation sent successfully!');
            setOpen(false);
            setFormData({
                email: '',
                salary: '',
                role: 'staff',
                department: '',
                designation: '',
                branchId: '',
                shiftId: '',
                expiryHours: '48',
            });
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to send invitation');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Employee
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Invite New Employee</DialogTitle>
                    <DialogDescription>
                        Send an invitation email to a new employee with their position details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="designation">Designation *</Label>
                            <Input
                                id="designation"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                placeholder="e.g. Software Developer"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="e.g. IT"
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">Role *</Label>
                            <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="team_leader">Team Leader</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="salary">Salary (৳) *</Label>
                            <Input
                                id="salary"
                                type="number"
                                min="0"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="branch">Branch *</Label>
                            <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branchesData?.branches?.map((branch: any) => (
                                        <SelectItem key={branch._id} value={branch._id}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="shift">Shift (Optional)</Label>
                            <Select value={formData.shiftId} onValueChange={(value) => setFormData({ ...formData, shiftId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">None</SelectItem>
                                    {shiftsData?.shifts?.map((shift: any) => (
                                        <SelectItem key={shift._id} value={shift._id}>
                                            {shift.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="expiry">Link Expiry (Hours) *</Label>
                            <Select value={formData.expiryHours} onValueChange={(value) => setFormData({ ...formData, expiryHours: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24">24 hours</SelectItem>
                                    <SelectItem value="48">48 hours</SelectItem>
                                    <SelectItem value="72">72 hours</SelectItem>
                                    <SelectItem value="168">1 week</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Invitation'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
