import React from "react";
import {ILab} from "@/models/lab";
import {formatDate} from "@/lib/utils";
import Content from "@/app/(user)/ban-do/cac-trung-tam-quan-trac-dat/content";

const tilerApiKey = process.env.MAP_TILER_API_KEY!
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchLabs() {
    const res = await fetch(`${baseUrl}/api/config/lab`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch lab');
    }
    return res.json();
}

export default async function CacTrungTamQuanTracDat() {
    const {labs} = await fetchLabs();

    return <div className={'box-border pb-40 flex flex-col gap-6 mt-6 lg:px-50 px-10 max-sm:px-6'}>
        <div className={'flex flex-col gap-6 h-full'}>
            <h1 className={'font-semibold text-center text-xl'}>CÁC TRUNG TÂM PHÂN TÍCH</h1>
            <Content
                labs={labs}
                tilerApiKey={tilerApiKey}
            />
        </div>
    </div>
}
