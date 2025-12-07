'use client';

import { useGetMeQuery } from '@/redux/features/staff/staffApi';
import { User } from 'better-auth';
import { ProfileSetupAlert } from './employee-dashboard/profile-setup-alert';

export default function EmployeeDashboard({ user }: { user: User }) {
    const {
        data,
        isLoading: isStaffLoading,
        isFetching: isStaffFetching,
    } = useGetMeQuery(
        {},
        {
            skip: !user.id,
        }
    );

    const isLoading = isStaffLoading || isStaffFetching;

    if (!isLoading && !data.staff.profileCompleted) {
        return <ProfileSetupAlert />;
    }

    return <div>EmployeeDashboard</div>;
}
