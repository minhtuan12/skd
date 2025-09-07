import type {Metadata} from "next";
import {Lato} from "next/font/google";
import "../globals.css";
import React from "react";
import Header from "@/components/layout/user/header";
import GoToTopButton from "@/components/custom/to-top-button";
import Footer from "@/components/layout/user/footer";
import {fetchGlobalConfig} from "@/app/(user)/thong-tin-chinh-sach/(fetch-data)/fetch-global-config";
import Hero from "@/components/layout/user/hero";
import {Toaster} from "@/components/ui/sonner";

const lato = Lato({
    subsets: ["latin"],
    weight: ["100", "300", "400", "700", "900"],
    variable: "--font-lato",
    style: ["italic", "normal"]
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
        <html lang="en" className={`${lato.className}`}>
        <body
            className={`${lato.variable} antialiased`}
        >
        <main className="min-h-screen w-full">
            <Header/>
            <Hero data={heroData.config}/>
            {children}
            <Footer/>
            <GoToTopButton/>
            <Toaster position="top-center" richColors/>
        </main>
        </body>
        </html>
    );
}
