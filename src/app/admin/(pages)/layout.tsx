import React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "../../globals.css"
import {SidebarProvider} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/layout/admin/app-sidebar"
import {AdminProvider} from "@/contexts/AdminContext";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "A modern admin dashboard built with Next.js and shadcn/ui",
}

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {

    return (
        <AdminProvider>
            <SidebarProvider>
                <AppSidebar/>
                {children}
            </SidebarProvider>
        </AdminProvider>
    )
}
