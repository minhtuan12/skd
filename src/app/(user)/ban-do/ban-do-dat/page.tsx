import React from "react";
import MapWrapper from "@/app/(user)/ban-do/ban-do-dat/map-wrapper";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchMaps() {
    const res = await fetch(`${baseUrl}/api/config/map`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch map');
    }
    return res.json();
}

export default async function BanDoDat() {
    const {maps, title} = await fetchMaps();

    return <div className={'box-border pb-40 flex flex-col gap-6 mt-6'}>
        <div className={'flex flex-col gap-6 h-full'}>
            <h1 className={'font-semibold text-center text-xl'}>{title?.toUpperCase() || 'BẢN ĐỒ ĐẤT'}</h1>
            <MapWrapper maps={maps}/>
        </div>
    </div>
}
