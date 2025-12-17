'use client';

import InvitationList from '@/components/admin/invitation-list';
import SendInvitation from '@/components/admin/send-invitation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function InvitationsPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
                <p className="text-muted-foreground">
                    Manage staff invitations and send new invitations
                </p>
            </div>

            <Tabs defaultValue="list" className="w-full">
                <TabsList>
                    <TabsTrigger value="list">Invitation List</TabsTrigger>
                    <TabsTrigger value="send">Send Invitation</TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="mt-6">
                    <InvitationList />
                </TabsContent>
                <TabsContent value="send" className="mt-6">
                    <SendInvitation />
                </TabsContent>
            </Tabs>
        </div>
    );
}
