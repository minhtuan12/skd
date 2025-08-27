'use client'

import React, {useState} from "react"
import "../../globals.css"
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/layout/admin/app-sidebar"
import {AdminProvider} from "@/contexts/AdminContext";
import {Separator} from "@/components/ui/separator";
import {Breadcrumb} from "@/components/layout/admin/breadcrumb";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {AdminButtonContext, ButtonHandlers} from "@/contexts/AdminButtonContext"

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {
    const pageTitle = useSelector((state: RootState) => state.admin.pageTitle);
    const [handlers, setHandlers] = useState<ButtonHandlers>({
        visibleReset: true,
        submitText: 'Cập nhật',
        reset: () => {
        },
        submit: () => {
        },
    });
    const [loading, setLoading] = useState(false);

    return (
        <AdminProvider>
            <AdminButtonContext.Provider value={{setHandlers, setLoading}}>
                <SidebarProvider>
                    <AppSidebar/>
                    <SidebarInset>
                        <header
                            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1 cursor-pointer"/>
                                <Separator orientation="vertical" className="mr-2 h-4"/>
                                <Breadcrumb/>
                            </div>
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </AdminButtonContext.Provider>
        </AdminProvider>
    )
}
