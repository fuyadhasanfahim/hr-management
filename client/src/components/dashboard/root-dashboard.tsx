'use client';

import { useSession } from '@/lib/auth-client';
import { Spinner } from '../ui/spinner';
import { Role } from '@/consonants/role';
import StaffDashboard from './staff-dashboard/staff-dashboard';

export default function RootDashboard() {
    const { data: session, isPending, isRefetching } = useSession();

    const isLoading = isPending || isRefetching;

    if (isLoading) {
        return;
    }

    if (
        session &&
        [Role.STAFF, Role.TEAM_LEADER].includes(session.user.role as Role)
    ) {
        return <StaffDashboard user={session.user} />;
    }

    return <div>RootDashboard</div>;
}
