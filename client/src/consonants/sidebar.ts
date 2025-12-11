import { Role } from '@/consonants/role';
import {
    IconLayoutDashboard,
    IconArrowsShuffle,
    IconCalendarOff,
    IconNotes,
    IconClock,
} from '@tabler/icons-react';

export const sidebarData = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: IconLayoutDashboard,
        access: [
            Role.SUPER_ADMIN,
            Role.ADMIN,
            Role.HR_MANAGER,
            Role.TEAM_LEADER,
            Role.STAFF,
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
            Role.STAFF,
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
            Role.STAFF,
        ],
    },
    {
        title: 'Overtime',
        url: '/overtime',
        icon: IconClock,
        access: [
            Role.SUPER_ADMIN,
            Role.ADMIN,
            Role.HR_MANAGER,
            Role.TEAM_LEADER,
            Role.STAFF,
        ],
    },
];
