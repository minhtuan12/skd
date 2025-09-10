import {fetchIntroduction} from "@/app/(user)/gioi-thieu/(fetch-data)/fetch-introduction";
import React from "react";

export default async function DuAn() {
    const data = await fetchIntroduction('project');
    return <div className={'box-border pb-18 pt-8 flex flex-col gap-6 xl:px-40 px-10 max-sm:px-6'}>
        <div className={'flex flex-col gap-6 px-6 xl:px-0'}>
            <h1 className={'font-semibold text-center text-xl'}>GIỚI THIỆU VỀ DỰ ÁN</h1>
            <div className={'flex-1'}>
                <div className={'prose'} dangerouslySetInnerHTML={{__html: data.introduction.project}}/>
            </div>
        </div>
    </div>
}
