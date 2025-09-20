"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {ChevronRight} from "lucide-react"
import {buildDetailPath, cn} from "@/lib/utils"
import type {Menu} from "@/constants/menu"
import {useEffect, useMemo, useRef} from "react"
import {SectionType} from "@/models/section";

interface ClientMenuItemProps {
    item: any
    parentHref?: string
    level?: number
}

function generateUrl(item: any) {
    if (item.type === SectionType.section) {
        return `/muc-luc/${item.header_key}?sub=${item._id}`;
    }
    if (item.href.includes('/muc-luc')) {
        return `/muc-luc/${item.key}`;
    }
    if (item.type === SectionType.post) {
        return item.post_id ? `/bai-viet/${item.post_id}` : '/';
    }
    switch (item.header_key) {
        case 'policy':
            return '/thong-tin-chinh-sach/chinh-sach/1'
        case 'map':
            if (item.name === 'Bản đồ đất') {
                return '/ban-do/ban-do-dat';
            }
            return '/ban-do/cac-trung-tam-quan-trac-dat';
        case 'knowledge':
            return `/ngan-hang-kien-thuc/${buildDetailPath(item.name, item._id as string)}/1`;
        case 'news':
            if (item.name === 'Nghiên cứu') return '/tin-tuc-va-su-kien/nghien-cuu/1';
            return '/tin-tuc-va-su-kien/tin-tuc-su-kien';
        default:
            return '/';
    }
}

export function MenuItem({item, parentHref = "", level = 0}: ClientMenuItemProps) {
    const pathname = usePathname()
    const hasChildren = item.children && item.children.length > 0 && !item.is_parent;

    const detailsRef = useRef<HTMLDetailsElement>(null)
    const currentItemHref = level === 0 ? item.href : `${parentHref}${item.href}`
    const isActiveRoute = currentItemHref === "/" ? pathname === "/" : pathname.startsWith(currentItemHref)

    const isAnyChildActive = useMemo(() => {
        if (!hasChildren) return false
        return item.children?.some((child: any) => {
            const childHref = `${currentItemHref}${child.href}`
            return pathname.startsWith(childHref)
        })
    }, [pathname, hasChildren, item.children, currentItemHref])

    useEffect(() => {
        if (detailsRef.current) {
            if (isAnyChildActive) {
                detailsRef.current.open = true
            } else if (!isActiveRoute) {
                detailsRef.current.open = false
            }
        }
    }, [isAnyChildActive, isActiveRoute, pathname])
    console.log(item)
    if (hasChildren) {
        return (
            <details
                ref={detailsRef}
                className="group w-full"
            >
                <summary
                    className={cn(
                        "flex items-center justify-between w-full py-2 px-3 rounded-md cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground transition-colors",
                        "list-none [&::-webkit-details-marker]:hidden",
                        level > 0 && "pl-6",
                        isActiveRoute && "bg-accent text-accent-foreground",
                    )}
                >
                    <div className="flex items-center gap-2">
            <span className={cn("truncate font-normal", isActiveRoute && "font-semibold text-black")}>
                <Link href={generateUrl(item)}>{item.title}</Link>
            </span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90"/>
                </summary>
                <div className="mt-1 space-y-1">
                    {item.children?.map((child: any, index: number) => (
                        <MenuItem key={index} item={child} level={level + 1} parentHref={currentItemHref}/>
                    ))}
                </div>
            </details>
        )
    }

    return (
        <Link
            href={generateUrl(item)}
            className={cn(
                "flex items-center gap-2 w-full py-2 px-3 rounded-md",
                "hover:bg-accent hover:text-accent-foreground transition-colors",
                "font-normal text-sm",
                level > 0 && "pl-6",
                level > 1 && "pl-8",
                isActiveRoute && "bg-accent text-accent-foreground font-semibold text-black",
            )}
        >
            <span className="truncate">{item.title}</span>
        </Link>
    )
}
