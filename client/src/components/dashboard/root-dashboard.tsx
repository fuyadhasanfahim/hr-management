'use client';

import { useSession } from '@/lib/auth-client';
import { Spinner } from '../ui/spinner';
import { Role } from '@/consonants/role';
import StaffDashboard from './staff-dashboard';

export default function RootDashboard() {
    const { data: session, isPending, isRefetching } = useSession();

    const isLoading = isPending || isRefetching;

    if (!session && isLoading) {
        return (
            <div className="h-full items-center justify-center flex">
                <Spinner />
            </div>
        );
    }

    if (session?.user.role === Role.EMPLOYEE) {
        return <StaffDashboard user={session.user} />;
    }

    return <div>RootDashboard</div>;
}
