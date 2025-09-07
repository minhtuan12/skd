import {formatDate, getIdFromSlug} from "@/lib/utils";
import Image from "next/image";
import React from "react";
import {INewsAndEvents} from "@/models/config";
import {fetchDetailNews} from "@/app/(user)/tin-tuc-va-su-kien/(fetch-data)/fetch-detail";
import {fetchNewsEvents} from "@/app/(user)/tin-tuc-va-su-kien/(fetch-data)/fetch-news-events";
import OtherItems from "@/app/(user)/tin-tuc-va-su-kien/chi-tiet/[slug]/other-items";

export default async function ({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const id: string = getIdFromSlug(slug);
    const item: INewsAndEvents = await fetchDetailNews(id);
    const otherItems = await fetchNewsEvents(item.type as any, 0);

    return (
        !item ? <div className={'text-gray-500 italic text-center'}>Không có thông tin</div> :
            <div className={'box-border flex flex-col gap-18 mt-10 lg:px-40 md:px-20 px-10 max-sm:px-6 pb-30'}>
                {/* Detail */}
                <div className={'flex flex-col gap-5 px-5'}>
                    <h1 className={'font-medium text-center text-3xl text-green-700'}>{item.title}</h1>
                    <Image
                        src={item.image_url as string}
                        alt={item.title} sizes={'100vw'}
                        width={0} height={0}
                        style={{width: '100%', height: '100%'}}
                    />
                    <div>{formatDate(item.date as any)}</div>
                    <div dangerouslySetInnerHTML={{__html: item.description}}
                         className={'xl:text-justify pr-2 box-border prose'}/>
                </div>

                {/* Others */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>
                            {item.type === 'research' ? 'Các nghiên cứu liên quan' : 'Các tin tức và sự kiện liên quan'}
                        </h1>
                    </div>
                    <div className={'w-full xl:px-14 lg:px-8'}>
                        <OtherItems items={otherItems} exceptId={id}/>
                    </div>
                </div>
            </div>
    );
}
