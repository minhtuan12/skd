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
    const popupHTMLs = labs.map((lab: ILab) => ({
        location: lab.location.coordinates,
        popup: `<div class="p-3 max-w-xs text-sm">
      <h3 class="font-semibold text-base text-gray-800 mb-2">${lab.name}</h3>
      <div class="space-y-1 text-gray-700 flex flex-col">
        <div class="'flex"><span class="font-semibold">• Lĩnh vực chỉ định:</span> ${lab.category}</div>
        <div class="'flex"><span class="font-semibold">• Địa chỉ:</span> ${lab.address}</div>
        <div class="'flex"><span class="font-semibold">• Thời gian cấp lần đầu:</span> ${formatDate(lab.first_license_date as string)}</div>
        <div class="'flex"><span class="font-semibold">• Hiệu lực:</span> ${formatDate(lab.validity_time as string)}</div>
        <div class="'flex"><span class="font-semibold">• Quyết định:</span> ${lab.decision}</div>
      </div>
    </div>`
    }));

    return <div className={'box-border pb-40 flex flex-col gap-6 mt-6 lg:px-30 px-10 max-sm:px-6'}>
        <div className={'flex flex-col gap-6 h-full'}>
            <h1 className={'font-semibold text-center text-xl'}>CÁC TRUNG TÂM PHÂN TÍCH</h1>
            <Content
                labs={labs}
                tilerApiKey={tilerApiKey}
                popupHTMLs={popupHTMLs}
            />
        </div>
    </div>
}
