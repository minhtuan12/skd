'use client'

import type React from "react"
import {Inter} from "next/font/google"
import "../globals.css"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const inter = Inter({subsets: ["latin"]})
const queryClient = new QueryClient()

export default function AdminLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
        </body>
        </html>
    )
}
