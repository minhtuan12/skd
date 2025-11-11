import type { Metadata } from "next";
import "../globals.css";
import React from "react";
import GoToTopButton from "@/components/custom/to-top-button";
import { fetchGlobalConfig } from "@/app/(user)/thong-tin-chinh-sach/(fetch-data)/fetch-global-config";
import Hero from "@/components/layout/user/hero";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/layout/user/header"));
const Footer = dynamic(() => import("@/components/layout/user/footer"));

const latoFont = localFont({
    src: [
        {
            path: '../fonts/Lato Black.ttf',
            style: 'normal',
            weight: '100'
        },
        {
            path: '../fonts/Lato Bold.ttf',
            style: 'normal',
            weight: '700'
        },
        {
            path: '../fonts/Lato Hairline.ttf',
            style: 'normal',
            weight: '400'
        },
        {
            path: '../fonts/Lato Heavy.ttf',
            style: 'normal',
            weight: '600'
        },
        {
            path: '../fonts/Lato Italic.ttf',
            style: 'italic',
            weight: '100'
        },
        {
            path: '../fonts/Lato Thin.ttf',
            style: 'normal',
            weight: '100'
        },
        {
            path: '../fonts/Lato Light.ttf',
            style: 'normal',
            weight: '100'
        },
        {
            path: '../fonts/Lato Medium.ttf',
            style: 'normal',
            weight: '500'
        },
        {
            path: '../fonts/Lato Regular.ttf',
            style: 'normal',
            weight: '400'
        },
        {
            path: '../fonts/Lato Semibold.ttf',
            style: 'normal',
            weight: '600'
        },

    ],
    variable: '--font-lato',
    display: 'swap'
})

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
        <html lang="en"
            className={`${latoFont.className}`}>
            <head>
                <meta name="google-site-verification" content="TsN4_FgWkK8ctMzhKTDyBADOk1voplVdDq19r_hZ7fw" />
            </head>
            <body
                className={`antialiased`}
            >
                <main className="min-h-screen w-full">
                    <Header />
                    <Hero data={heroData.config} />
                    {children}
                    <Footer traffic={heroData.traffic} />
                    <GoToTopButton />
                    <Toaster position="top-center" richColors />
                </main>
            </body>
        </html>
    );
}
