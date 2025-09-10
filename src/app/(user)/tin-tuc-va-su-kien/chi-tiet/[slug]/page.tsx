import {buildDetailPath, formatDate, getIdFromSlug} from "@/lib/utils";
import Image from "next/image";
import React from "react";
import {INewsAndEvents} from "@/models/config";
import {fetchDetailNews} from "@/app/(user)/tin-tuc-va-su-kien/(fetch-data)/fetch-detail";
import {fetchNewsEvents} from "@/app/(user)/tin-tuc-va-su-kien/(fetch-data)/fetch-news-events";
import OtherItems from "@/app/(user)/tin-tuc-va-su-kien/chi-tiet/[slug]/other-items";
import {IKnowledge} from "@/models/knowledge";
import Link from "next/link";

export default async function ({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const id: string = getIdFromSlug(slug);
    const item: INewsAndEvents = await fetchDetailNews(id);
    const otherItems = await fetchNewsEvents(item.type as any, 0);
    const diffPosts = otherItems?.filter(
        (i: any) =>
            i._id !== id &&
            !item?.related_posts?.some(it => (it as INewsAndEvents)._id === i._id)
    )?.slice(0, 5) || [];

    return (
        !item ? <div className={'text-gray-500 italic text-center'}>Không có thông tin</div> :
            <div className={'box-border flex flex-col gap-18 mt-10 lg:px-40 md:px-20 px-10 max-sm:px-6 pb-30'}>
                {/* Detail */}
                <div className={'flex flex-col gap-5 px-5 2xl:px-50 xl:px-30'}>
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

                {/* Related */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>
                            {item.type === 'research' ? 'Các nghiên cứu liên quan' : 'Các tin tức và sự kiện liên quan'}
                        </h1>
                    </div>
                    {
                        item?.related_posts?.length > 0 ?
                            <div className={'w-full 2xl:px-60 xl:px-30 lg:px-4'}>
                                <OtherItems items={otherItems} exceptId={id}/>
                            </div>
                            : <i className={'text-gray-500'}>Chưa có các tin liên quan</i>
                    }
                </div>

                {/* Others */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>
                            {item.type === 'research' ? 'Các nghiên cứu khác' : 'Các tin tức và sự kiện khác'}
                        </h1>
                    </div>
                    <div className={'grid grid-cols-1 2xl:px-60 xl:px-30 lg:px-4'}>
                        {
                            diffPosts?.length > 0 ? diffPosts.map((i: IKnowledge, index: number) => (
                                <div
                                    key={i._id}
                                    className={'border-t items-center border-gray-200 box-border pt-3 pb-5 pl-1 pr-4'}
                                >
                                    <Link
                                        className={'hover:text-green-500 text-lg'}
                                        href={`/tin-tuc-va-su-kien/chi-tiet/${buildDetailPath(i.name, i._id as string)}`}
                                    >
                                        {i.name}
                                    </Link>
                                </div>
                            )) : <i className={'text-gray-500'}>Chưa có thông tin mới</i>
                        }
                    </div>
                </div>
            </div>
    );
}
