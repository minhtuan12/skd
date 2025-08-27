import Developing from "@/components/custom/developing";
import {INewsAndEvents} from "@/models/config";
import CardNews from "@/app/(user)/tin-tuc-va-su-kien/tin-tuc-su-kien/@news/card-news";
import {Pagination, PaginationContent, PaginationItem, PaginationLink} from "@/components/ui/pagination";
import {ChevronRight} from "lucide-react";
import React from "react";

export default function TaiLieuTapHuan() {
    return <>
        <h1 className={'font-semibold text-center text-xl'}>NGHIÊN CỨU</h1>
        <div className={'flex gap-12 flex-col'}>
            <div className={'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-7'}>
                {/*{*/}
                {/*    researches.data.map((item: INewsAndEvents) => (*/}
                {/*        <CardNews*/}
                {/*            className={'cursor-pointer'}*/}
                {/*            key={item._id}*/}
                {/*            news={item}*/}
                {/*            hideDetailBtn*/}
                {/*            imageHeight={293}*/}
                {/*        />*/}
                {/*    ))*/}
                {/*}*/}
            </div>
            <Pagination className={'justify-end'}>
                <PaginationContent>
                    {/*{Array.from({length: researches?.totalPages}, (_, i) => (*/}
                    {/*    <PaginationItem key={i}>*/}
                    {/*        <PaginationLink*/}
                    {/*            isActive={page === i + 1}*/}
                    {/*            href={`/tin-tuc-va-su-kien/nghien-cuu/${i + 1}`}*/}
                    {/*        >*/}
                    {/*            {i + 1}*/}
                    {/*        </PaginationLink>*/}
                    {/*    </PaginationItem>*/}
                    {/*))}*/}
                    {/*<PaginationItem>*/}
                    {/*    <PaginationLink href={page < researches.totalPages ?*/}
                    {/*        `/tin-tuc-va-su-kien/nghien-cuu/${page + 1}` : ''}*/}
                    {/*    >*/}
                    {/*        <ChevronRight/>*/}
                    {/*    </PaginationLink>*/}
                    {/*</PaginationItem>*/}
                </PaginationContent>
            </Pagination>
        </div>
    </>
}
