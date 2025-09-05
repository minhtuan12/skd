import PptViewer from "@/components/custom/ppt-viewer";
import {Loader2} from "lucide-react";
import React from "react";
import {fetchPolicy} from "@/app/(user)/thong-tin-chinh-sach/(fetch-data)/fetch-policy";

async function fetchPlanConfig() {
    try {
        return await fetchPolicy('plan');
    } catch (error) {
        console.error(error);
        return {
            draft_ppt_link: '#',
            slides: []
        };
    }
}

export default async function ChienLuoc() {
    const policy = await fetchPlanConfig();

    return <div className={'box-border pb-18 pt-8 flex flex-col gap-6'}>
        <div className={'flex flex-col gap-6 px-6 xl:px-0'}>
            <h1 className={'font-semibold text-center text-xl'}>KẾ HOẠCH HÀNH ĐỘNG SỨC KHỎE ĐẤT QUỐC GIA</h1>
            <div className={'flex-1'}>
                {!policy ? <div className={'flex items-center justify-center h-full w-full mt-8'}><Loader2
                        className="h-6 w-6 animate-spin"/></div> :
                    (
                        policy.draft_ppt_link === '#' ?
                            <div className={'text-gray-500 font-medium italic w-full text-center'}>
                                Chưa có bản dự thảo nào
                            </div> : <PptViewer
                                slides={policy.slides} pptUrl={policy.draft_ppt_link}
                                downloadNotification={policy.download_notification}
                            />
                    )
                }
            </div>
        </div>
    </div>
}
