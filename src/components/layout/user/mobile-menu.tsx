import type React from "react"
import {cn} from "@/lib/utils"
import {menu} from "@/constants/menu";
import {MenuItem} from "@/components/layout/user/menu-item";

interface ServerMenuProps {
    menuItems: any
    className?: string
}

export default function MobileMenu({menuItems, className}: ServerMenuProps) {
    return (
        <nav className={cn("w-full space-y-1", className)}>
            {menuItems.map((item: any, index: number) => (
                <MenuItem key={index} item={item}/>
            ))}
        </nav>
    )
}
