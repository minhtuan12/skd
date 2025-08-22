import type React from "react"
import {cn} from "@/lib/utils"
import {menu} from "@/constants/menu";
import {MenuItem} from "@/components/layout/user/menu-item";

interface ServerMenuProps {
    className?: string
}

export default function MobileMenu({className}: ServerMenuProps) {
    return (
        <nav className={cn("w-full space-y-1", className)}>
            {menu.map((item, index) => (
                <MenuItem key={index} item={item}/>
            ))}
        </nav>
    )
}
