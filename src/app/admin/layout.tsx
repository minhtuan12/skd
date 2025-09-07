'use client'

import type React from "react"
import "../globals.css"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider} from "react-redux";
import {store} from "@/redux/store";
import {Toaster} from "@/components/ui/sonner";

const queryClient = new QueryClient()

export default function AdminLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {
    return (
        <html lang="en">
        <head>
            <title>Trang quản trị SKĐ</title>
        </head>
        <body>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </Provider>
        <Toaster position="top-center" richColors/>
        </body>
        </html>
    )
}
