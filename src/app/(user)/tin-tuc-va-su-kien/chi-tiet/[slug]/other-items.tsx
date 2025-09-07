'use client'

import React, {useCallback, useMemo, useState} from "react";
import {ChevronLeft, ChevronRight, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {IPolicyDocument} from "@/models/policy-document";
import Link from "next/link";
import {buildDetailPath, formatDateVN} from "@/lib/utils";
import Image from "next/image";
import {INewsAndEvents} from "@/models/config";

function OtherItems({items, exceptId}: { items: any, exceptId: string }) {
    const [start, setStart] = useState(0);
    const filteredItems = useMemo(() => {
        return items.filter((i: IPolicyDocument) => i._id !== exceptId);
    }, [exceptId, items])

    const scrollNext = useCallback(() => {
        if (start + 3 < filteredItems.length) {
            setStart(prev => prev + 3);
        }
    }, [start, filteredItems.length]);

    const scrollPrev = useCallback(() => {
        if (start - 3 >= 0) {
            setStart(prev => prev - 3);
        }
    }, [start]);

    const newsList = useMemo(() => {
        if (start + 3 <= filteredItems.length) {
            return filteredItems.slice(start, start + 3);
        }
        return filteredItems.slice(start);
    }, [start, filteredItems]);

    return !items ? <Loader2 className={'animate-spin w-7 h-7'}/> :
        <>
            {
                filteredItems.length === 0 ? <div className={'italic text-gray-700 font-medium'}>
                        Chưa có những chính sách mới
                    </div> :
                    <>
                        <div
                            className={'w-full flex flex-col gap-6 md:flex-row md:gap-x-6 xl:gap-x-10 h-140 justify-center'}>
                            {
                                newsList.map((item: INewsAndEvents) => {
                                    const {day, year, month} = formatDateVN(item.date);
                                    const detailPath = buildDetailPath(item.title, item._id as string);

                                    return <Link
                                        href={`/tin-tuc-va-su-kien/chi-tiet/${detailPath}`}
                                        key={item._id}
                                        className={'rounded-md w-full md:w-1/3 relative h-full overflow-hidden cursor-pointer hover:shadow-2xl'}
                                    >
                                        <Image
                                            src={item.image_url as string}
                                            alt={item.title}
                                            objectFit="cover"
                                            layout="fill"
                                        />
                                        <div className={`absolute inset-0 bg-[#00000080]`}/>
                                        <div
                                            className="absolute inset-0 p-7 text-white box-border flex flex-row gap-8 md:gap-5 md:flex-col max-md:items-center">
                                            <div className={'bg-white box-border py-3 px-5 w-fit rounded-lg'}>
                                                <p className={'text-orange-300 font-bold text-3xl text-center'}>
                                                    {day}
                                                </p>
                                                <p className={'text-green-700 font-semibold text-xl text-center mt-1 -mb-1'}>{month}</p>
                                                <p className={'text-green-700 font-semibold text-xl text-center'}>{year}</p>
                                            </div>
                                            <h3 className="text-2xl leading-8 line-clamp-2 md:text-4xl md:leading-12 md:line-clamp-6 drop-shadow-md md:mt-5">{item.title}</h3>
                                        </div>
                                    </Link>
                                })
                            }
                        </div>
                        <div className={'w-full justify-between flex mt-4'}>
                            <Button
                                onClick={scrollPrev}
                                className={'rounded-[50%] bg-white border-gray-400 hover:bg-gray-100 border w-10 h-10 flex items-center justify-center text-black'}>
                                <ChevronLeft/>
                            </Button>
                            <Button
                                onClick={scrollNext}
                                className={'rounded-[50%] bg-white border-gray-400 hover:bg-gray-100 border w-10 h-10 flex items-center justify-center text-black'}>
                                <ChevronRight/>
                            </Button>
                        </div>
                    </>
            }
        </>
}

export default React.memo(OtherItems);
