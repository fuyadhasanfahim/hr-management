'use client';

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { data } from './data';
import { useSession } from '@/lib/auth-client';
import { Skeleton } from '../ui/skeleton';
import { Role } from '@/consonants/role';
import Link from 'next/link';

export function NavMain() {
    const { data: session, isPending, isRefetching } = useSession();
    const pathname = usePathname();

    if (isPending || (isRefetching && !session)) {
        return (
            <SidebarGroup className="px-4">
                <SidebarGroupContent>
                    <SidebarMenu className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <SidebarMenuItem key={i}>
                                <Skeleton className="h-8 w-full bg-muted animate-pulse" />
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }

    const userRole = session?.user?.role;

    const filteredData = data.filter((item) =>
        userRole ? item.access.includes(userRole as Role) : false
    );

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {filteredData.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                className={cn(
                                    pathname.startsWith(item.url) &&
                                        'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                                    ' active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear'
                                )}
                                asChild
                            >
                                <Link href={item.url}>
                                    {item.icon && (
                                        <item.icon
                                            strokeWidth={2}
                                            className="size-4 shrink-0"
                                        />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
