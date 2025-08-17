'use client'

import {ChevronUp, User2,} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {useAdmin} from "@/contexts/AdminContext";
import {Skeleton} from "@/components/ui/skeleton";
import {sideBarItems} from "@/constants/menu";
import {useRouter} from "next/navigation";

export function AppSidebar() {
    const {admin, logout} = useAdmin();
    const router = useRouter();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                    <img src={'/logos/principles.png'} alt={'Principles'}/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Sức Khỏe Đất</span>
                                    <span className="truncate text-xs">Trang chủ</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {
                    sideBarItems.map((item, index) => (
                        <SidebarGroup key={index}>
                            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {item.children.map((child) => (
                                        <SidebarMenuItem key={child.title}>
                                            <SidebarMenuButton asChild>
                                                <div onClick={() => router.push(child.url)}
                                                     className={'cursor-pointer'}>
                                                    <child.icon/>
                                                    <span>{child.title}</span>
                                                </div>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                }
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={!admin}>
                                <SidebarMenuButton
                                    disabled={!admin}
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    {admin ? <User2 className="size-4 ml-1.5"/> :
                                        <Skeleton className="h-8 w-8 rounded-full"/>}
                                    <div
                                        className="grid flex-1 flex-col items-center text-left text-sm leading-tight h-full">
                                        {admin ?
                                            <span className="truncate font-semibold">{admin?.username || ''}</span> :
                                            <div className={'flex items-center justify-center gap-1 flex-col'}>
                                                <Skeleton className={'w-full h-1/2'}/>
                                                <Skeleton className={'w-full h-1/2'}/>
                                            </div>
                                        }
                                    </div>
                                    <ChevronUp className="ml-auto size-4"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
