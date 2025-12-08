import { Role } from '@/consonants/role';

export const blockedRoute: Record<string, Role[]> = {
    '/leave': [Role.SUPER_ADMIN],
};
