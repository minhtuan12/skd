'use client'

import {ChevronRight, ChevronUp, Loader2, Newspaper, User2,} from "lucide-react"
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {useAdmin} from "@/contexts/AdminContext";
import {Skeleton} from "@/components/ui/skeleton";
import {sideBarItems} from "@/constants/menu";
import {usePathname, useRouter} from "next/navigation";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {useFetchKnowledgeCategory} from "@/app/admin/config/(hooks)/use-knowledge-category";
import {routes} from "@/constants/routes";
import {IKnowledgeCategory} from "@/models/knowledge-category";
import {useMemo} from "react";
import {useDispatch} from "react-redux";

export function AppSidebar() {
    const {admin, logout} = useAdmin();
    const router = useRouter();
    const pathname = usePathname();
    const {loading, data} = useFetchKnowledgeCategory();
    const items = useMemo(() => {
        if (data?.pages) {
            return sideBarItems.map(item => {
                return {
                    ...item,
                    children: item.children.map((child: any) => {
                        if (child.url.includes(routes.KnowledgeConfig)) {
                            return {
                                ...child,
                                children: [
                                    ...child.children,
                                    ...data.pages.map((i: IKnowledgeCategory) => ({
                                        title: i.name,
                                        url: `/${i._id}`,
                                        icon: Newspaper,
                                    }))
                                ]
                            }
                        }
                        return child;
                    })
                }
            })
        }
        return sideBarItems;
    }, [data]);
    const dispatch = useDispatch();

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
                {loading ? <div className={'h-full w-full flex items-center justify-center'}>
                        <Loader2 className={'w-5 h-5 animate-spin'}/>
                    </div> :
                    items.map((item, index) => (
                        <SidebarGroup key={index}>
                            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {item.children.map((child, index) => (
                                        child.children ?
                                            <Collapsible
                                                className="group/collapsible" key={index}
                                                defaultOpen={pathname.includes(child.url)}
                                            >
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild
                                                                        className={'[&[data-state=open]>svg]:rotate-90'}>
                                                        <SidebarMenuButton
                                                            className={'flex justify-between cursor-pointer'}
                                                            isActive={pathname.includes(child.url)}>
                                                            <div className={'flex items-center gap-2'}>
                                                                <child.icon className={'w-4 h-4'}/>
                                                                {child.title}
                                                            </div>
                                                            <ChevronRight className={'transition-transform'}/>
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {
                                                                child.children.map((i: any, idx: number) => (
                                                                    <SidebarMenuSubItem key={idx}>
                                                                        <SidebarMenuSubButton
                                                                            asChild
                                                                            isActive={pathname.includes(i.url)}
                                                                        >
                                                                            <div
                                                                                onClick={() => {
                                                                                    router.push(child.url + i.url)
                                                                                }}
                                                                                className={'cursor-pointer'}>
                                                                                <i.icon/>
                                                                                <span>{i.title}</span>
                                                                            </div>
                                                                        </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                ))
                                                            }
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuItem>
                                            </Collapsible>
                                            : <SidebarMenuItem key={child.title}>
                                                <SidebarMenuButton asChild
                                                                   isActive={pathname[pathname.length - 1] === child.url}>
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
