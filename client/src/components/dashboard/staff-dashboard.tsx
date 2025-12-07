'use client';

import { useGetMeQuery } from '@/redux/features/staff/staffApi';
import { User } from 'better-auth';
import { ProfileSetupAlert } from './staff-dashboard/profile-setup-alert';

export default function StaffDashboard({ user }: { user: User }) {
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

    return <div>StaffDashboard</div>;
}
