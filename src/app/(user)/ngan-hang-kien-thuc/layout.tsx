import React from "react";

export default async function Layout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {
    return <div className={'box-border flex flex-col gap-8 mt-10 lg:px-30 px-10 max-sm:px-6 pb-30'}>
        <div className={'flex flex-col gap-8 px-5'}>
            {children}
        </div>
    </div>
}