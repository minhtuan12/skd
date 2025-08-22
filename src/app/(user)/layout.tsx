import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../globals.css";
import React from "react";
import Header from "@/components/layout/user/header";
import GoToTopButton from "@/components/custom/to-top-button";
import Footer from "@/components/layout/user/footer";
import {fetchGlobalConfig} from "@/app/(user)/thong-tin-chinh-sach/(fetch-data)/fetch-global-config";
import Hero from "@/components/layout/user/hero";

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

export default async function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {
    const heroData = await fetchGlobalConfig();

    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <main className="min-h-screen w-full">
            <Header/>
            <Hero data={heroData.config}/>
            {children}
            <Footer/>
            <GoToTopButton/>
        </main>
        </body>
        </html>
    );
}
