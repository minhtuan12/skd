import React from "react";
import MapList from "@/app/(user)/ban-do/ban-do-dat/map-list";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchMaps() {
    const res = await fetch(`${baseUrl}/api/config/map`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch config');
    }
    return res.json();
}

export default async function BanDoDat() {
    const {maps} = await fetchMaps();

    return <div className={'box-border pb-40 flex flex-col gap-6 mt-6'}>
        <div className={'flex flex-col gap-6 h-full'}>
            <h1 className={'font-semibold text-center text-xl'}>BẢN ĐỒ ĐẤT</h1>
            <div className={'flex flex-col gap-14'}>
                <div className={'bg-gray-50 lg:px-26 px-10 max-sm:px-6 py-12'}>
                    <MapList maps={maps}/>
                </div>
            </div>
        </div>
    </div>
}
