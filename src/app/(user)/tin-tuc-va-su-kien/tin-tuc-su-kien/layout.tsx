import React from "react";
import { fetchNewsEvents } from "@/app/(user)/tin-tuc-va-su-kien/(fetch-data)/fetch-news-events";
import { INewsAndEvents } from "@/models/config";
import dynamic from "next/dynamic";

const CardNews = dynamic(() => import("@/app/(user)/tin-tuc-va-su-kien/tin-tuc-su-kien/@news/card-news"));

export default async function TinTucSuKien(
    { news, events }:
        { news: React.ReactNode, events: React.ReactNode }
) {
    const newsData = await fetchNewsEvents('news');

    return <div className={'box-border pb-40 flex flex-col gap-8 mt-10 lg:px-30 px-10 max-sm:px-6'}>
        {/* News */}
        <div className={'flex flex-col gap-8 border-b-3 border-gray-300 pb-5 px-5'}>
            <h1 className={'font-semibold text-center text-xl'}>TIN TỨC</h1>
            <div className={'flex gap-12'}>
                <div className={'w-2/3 flex flex-col gap-6'}>
                    <CardNews news={newsData.topNews[0]} imageHeight={400} />
                    <div className={'w-full grid grid-cols-1 gap-y-8 md:gap-y-0 md:grid-cols-2 gap-x-6'}>
                        {newsData.topNews.slice(1, 3).map((item: INewsAndEvents, index: number) => (
                            <CardNews news={item} key={index} />
                        ))}
                    </div>
                </div>
                <div className={'w-1/3 flex flex-col gap-10 justify-between'}>
                    {news}
                </div>
            </div>
        </div>
        {/* Events */}
        <div className={'flex flex-col gap-8'}>
            <div className={'flex justify-center w-full'}>
                <h1 className={'font-semibold text-center text-xl w-40 border-t-green-700 border-t-4 pt-2'}>SỰ KIỆN</h1>
            </div>
            <div className={'w-full xl:px-14 lg:px-8'}>
                {events}
            </div>
        </div>
    </div>
}
