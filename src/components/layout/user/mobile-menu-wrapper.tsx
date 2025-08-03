'use client'

import React, {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Menu as MenuIcon} from "lucide-react";

export default function MobileMenuWrapper({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger><MenuIcon color={'#000'}/></SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription className={'flex flex-col gap-1 mt-3 pb-2 overflow-y-auto h-screen'} asChild>
                        {children}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
