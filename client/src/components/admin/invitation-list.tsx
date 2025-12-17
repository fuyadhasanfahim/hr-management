'use client';

import { useState } from 'react';
import { useGetInvitationsQuery, useResendInvitationMutation, useCancelInvitationMutation } from '@/redux/features/invitation/invitationApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import InviteEmployeeDialog from './invite-employee-dialog';

export default function InvitationList() {
    const [filter, setFilter] = useState<'all' | 'pending' | 'used'>('all');
    const { data, isLoading, refetch } = useGetInvitationsQuery(
        filter === 'all' ? undefined : { isUsed: filter === 'used' }
    );
    const [resendInvitation, { isLoading: isResending }] = useResendInvitationMutation();
    const [cancelInvitation, { isLoading: isCanceling }] = useCancelInvitationMutation();

    const handleResend = async (id: string) => {
        try {
            await resendInvitation(id).unwrap();
            toast.success('Invitation resent successfully!');
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to resend invitation');
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this invitation?')) return;

        try {
            await cancelInvitation(id).unwrap();
            toast.success('Invitation cancelled successfully!');
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to cancel invitation');
        }
    };

    const invitations = data?.data || [];
    const pendingInvitations = invitations.filter((inv) => !inv.isUsed && new Date(inv.expiresAt) > new Date());
    const usedInvitations = invitations.filter((inv) => inv.isUsed);
    const expiredInvitations = invitations.filter((inv) => !inv.isUsed && new Date(inv.expiresAt) <= new Date());

    const getStatusBadge = (invitation: any) => {
        if (invitation.isUsed) {
            return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="mr-1 h-3 w-3" />Used</Badge>;
        }
        if (new Date(invitation.expiresAt) <= new Date()) {
            return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Expired</Badge>;
        }
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
    };

    const renderTable = (invitations: any[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invitations.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No invitations found
                        </TableCell>
                    </TableRow>
                ) : (
                    invitations.map((invitation) => (
                        <TableRow key={invitation._id}>
                            <TableCell className="font-medium">{invitation.email}</TableCell>
                            <TableCell>{invitation.designation}</TableCell>
                            <TableCell className="capitalize">{invitation.role.replace('_', ' ')}</TableCell>
                            <TableCell>৳{invitation.salary.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(invitation)}</TableCell>
                            <TableCell>
                                {format(new Date(invitation.expiresAt), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {!invitation.isUsed && new Date(invitation.expiresAt) > new Date() && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleResend(invitation._id)}
                                                disabled={isResending}
                                            >
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleCancel(invitation._id)}
                                                disabled={isCanceling}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Employee Invitations</CardTitle>
                        <CardDescription>
                            Manage pending and sent employee invitations
                        </CardDescription>
                    </div>
                    <InviteEmployeeDialog />
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" onValueChange={(v: string) => setFilter(v as any)}>
                    <TabsList>
                        <TabsTrigger value="all">
                            All ({invitations.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            Pending ({pendingInvitations.length})
                        </TabsTrigger>
                        <TabsTrigger value="used">
                            Used ({usedInvitations.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4">
                        {renderTable(invitations)}
                    </TabsContent>

                    <TabsContent value="pending" className="mt-4">
                        {renderTable(pendingInvitations)}
                    </TabsContent>

                    <TabsContent value="used" className="mt-4">
                        {renderTable(usedInvitations)}
                    </TabsContent>
                </Tabs>

                {expiredInvitations.length > 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>{expiredInvitations.length}</strong> invitation(s) have expired and need to be resent or cancelled.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
