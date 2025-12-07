import { Role } from '@/consonants/role';
import {
    IconLayoutDashboard,
    IconArrowsShuffle,
    IconCalendarOff,
    IconNotes,
} from '@tabler/icons-react';

export const data = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: IconLayoutDashboard,
        access: [
            Role.SUPER_ADMIN,
            Role.ADMIN,
            Role.HR_MANAGER,
            Role.TEAM_LEADER,
            Role.EMPLOYEE,
        ],
    },
    {
        title: 'Shifting',
        url: '/shifting',
        icon: IconArrowsShuffle,
        access: [
            Role.SUPER_ADMIN,
            Role.ADMIN,
            Role.HR_MANAGER,
            Role.TEAM_LEADER,
        ],
    },
    {
        title: 'Notices & Announcements',
        url: '/notices',
        icon: IconNotes,
        access: [
            Role.SUPER_ADMIN,
            Role.ADMIN,
            Role.HR_MANAGER,
            Role.TEAM_LEADER,
            Role.EMPLOYEE,
        ],
    },
    {
        title: 'Leave Application',
        url: '/leave/apply',
        icon: IconCalendarOff,
        access: [
            Role.SUPER_ADMIN,
            Role.ADMIN,
            Role.HR_MANAGER,
            Role.TEAM_LEADER,
            Role.EMPLOYEE,
        ],
    },
];
