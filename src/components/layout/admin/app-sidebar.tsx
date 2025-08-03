'use client'

import {
    BarChart3,
    Calendar,
    ChevronUp,
    CreditCard,
    Home,
    Inbox,
    Package,
    Search,
    Settings,
    ShoppingCart,
    User2,
    Users,
} from "lucide-react"

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

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Orders",
        url: "#",
        icon: ShoppingCart,
    },
    {
        title: "Products",
        url: "#",
        icon: Package,
    },
    {
        title: "Customers",
        url: "#",
        icon: Users,
    },
    {
        title: "Analytics",
        url: "#",
        icon: BarChart3,
    },
    {
        title: "Payments",
        url: "#",
        icon: CreditCard,
    },
]

const secondaryItems = [
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    const {admin, logout} = useAdmin();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
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
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
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
