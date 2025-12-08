import { sidebarData } from '@/consonants/sidebar';
import { Role } from '@/consonants/role';

export function generateRouteAccess() {
    const map: Record<string, Role[]> = {};

    for (const item of sidebarData) {
        map[item.url] = item.access;
    }

    return map;
}
