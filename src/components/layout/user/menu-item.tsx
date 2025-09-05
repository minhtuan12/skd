"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {ChevronRight} from "lucide-react"
import {cn} from "@/lib/utils"
import type {Menu} from "@/constants/menu"
import {useEffect, useMemo, useRef} from "react"

interface ClientMenuItemProps {
    item: Menu
    parentHref?: string
    level?: number
}

export function MenuItem({item, parentHref = "", level = 0}: ClientMenuItemProps) {
    const pathname = usePathname()
    const hasChildren = item.children && item.children.length > 0

    const detailsRef = useRef<HTMLDetailsElement>(null)
    const currentItemHref = level === 0 ? item.href : `${parentHref}${item.href}`
    const isActiveRoute = currentItemHref === "/" ? pathname === "/" : pathname.startsWith(currentItemHref)

    const isAnyChildActive = useMemo(() => {
        if (!hasChildren) return false
        return item.children?.some((child) => {
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
              {item.title}
            </span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90"/>
                </summary>
                <div className="mt-1 space-y-1">
                    {item.children?.map((child, index) => (
                        <MenuItem key={index} item={child} level={level + 1} parentHref={currentItemHref}/>
                    ))}
                </div>
            </details>
        )
    }

    return (
        <Link
            href={item.hasPages ? (currentItemHref + '/1') : currentItemHref}
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
