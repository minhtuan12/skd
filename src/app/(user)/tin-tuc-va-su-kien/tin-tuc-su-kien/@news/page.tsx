'use client'

import {INewsAndEvents} from "@/models/config";
import CardNews from "@/components/custom/card-news";
import {Pagination, PaginationContent, PaginationItem, PaginationLink} from "@/components/ui/pagination";
import {ChevronRight, Loader2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {fetchNewsEvents} from "@/app/(user)/tin-tuc-va-su-kien/(fetch-data)/fetch-news-events";

function News() {
    const [page, setPage] = useState(1);
    const [news, setNews] = useState<{ data: INewsAndEvents[], totalPages: number } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchNewsEvents('news', page);
            setNews(data);
        }
        fetchData();
    }, [page]);

    const handleChangePage = (page: number) => {
        setNews(null);
        setPage(page);
    }

    return <>
        {!news ? <Loader2 className={'h-7 w-7 animate-spin'}/> : <>
            <div className={'flex flex-col gap-4'}>
                {news?.data.map((item: INewsAndEvents, index: number) => (
                    <CardNews
                        key={item._id} news={item}
                        hideImage
                        className={`${index !== 0 ? 'border-t border-gray-300 py-4' : ''}`}
                    />
                ))}
            </div>
            <Pagination className={'justify-end'}>
                <PaginationContent>
                    {Array.from({length: news?.totalPages}, (_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink
                                isActive={page === i + 1}
                                onClick={() => {
                                    handleChangePage(i + 1)
                                }}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationLink onClick={() => {
                            if (page < news?.totalPages) {
                                handleChangePage(page + 1);
                            }
                        }}>
                            <ChevronRight/>
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
        }
    </>
}

export default React.memo(News);
