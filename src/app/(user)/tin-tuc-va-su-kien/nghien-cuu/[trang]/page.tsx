import React from "react";
import {fetchNewsEvents} from "@/app/(user)/tin-tuc-va-su-kien/(fetch-data)/fetch-news-events";
import {INewsAndEvents} from "@/models/config";
import {Pagination, PaginationContent, PaginationItem, PaginationLink} from "@/components/ui/pagination";
import {ChevronRight} from "lucide-react";
import dynamic from "next/dynamic";

const CardNews = dynamic(() => import("@/app/(user)/tin-tuc-va-su-kien/tin-tuc-su-kien/@news/card-news"));

export default async function NghienCuu({params}: { params: Promise<{ trang: string }> }) {
    const {trang} = await params;
    const page = parseInt(trang || '1');
    const researches = await fetchNewsEvents('researches', page);

    return <div className={'box-border flex flex-col gap-8 mt-10 lg:px-30 px-10 max-sm:px-6 pb-30'}>
        <div className={'flex flex-col gap-8 px-5'}>
            <h1 className={'font-semibold text-center text-xl'}>NGHIÊN CỨU</h1>
            <div className={'flex gap-12 flex-col'}>
                <div className={'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-7'}>
                    {
                        researches.data.map((item: INewsAndEvents) => (
                            <CardNews
                                className={'cursor-pointer'}
                                key={item._id}
                                news={item}
                                hideDetailBtn
                                imageHeight={293}
                            />
                        ))
                    }
                </div>
                <Pagination className={'justify-end'}>
                    <PaginationContent>
                        {Array.from({length: researches?.totalPages}, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    isActive={page === i + 1}
                                    href={`/tin-tuc-va-su-kien/nghien-cuu/${i + 1}`}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationLink href={page < researches.totalPages ?
                                `/tin-tuc-va-su-kien/nghien-cuu/${page + 1}` : ''}
                            >
                                <ChevronRight/>
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    </div>
}
