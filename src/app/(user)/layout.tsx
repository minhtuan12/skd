import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../globals.css";
import React from "react";
import Header from "@/components/layout/user/header";
import GoToTopButton from "@/components/custom/to-top-button";
import Footer from "@/components/layout/user/footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sức Khỏe Đất",
    description: "Sức Khỏe Đất",
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchHomeConfig() {
    const res = await fetch(`${baseUrl}/api/config`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch config');
    }
    return res.json();
}

export default function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <main className="min-h-screen w-full">
            <Header/>
            {children}
            <Footer/>
            <GoToTopButton/>
        </main>
        </body>
        </html>
    );
}
