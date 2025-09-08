'use client'

import React, {useCallback, useMemo, useState} from "react";
import {ChevronLeft, ChevronRight, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {IPolicyDocument} from "@/models/policy-document";
import Link from "next/link";
import {buildDetailPath} from "@/lib/utils";
import Image from "next/image";

function DocumentList({documents, exceptId}: { documents: any, exceptId: string }) {
    const [start, setStart] = useState(0);
    const docs = useMemo(() => {
        return documents.filter((i: IPolicyDocument) => i._id !== exceptId);
    }, [exceptId, documents])

    const scrollNext = useCallback(() => {
        if (start + 3 < docs.length) {
            setStart(prev => prev + 3);
        }
    }, [start, docs.length]);

    const scrollPrev = useCallback(() => {
        if (start - 3 >= 0) {
            setStart(prev => prev - 3);
        }
    }, [start]);

    const documentList = useMemo(() => {
        if (start + 3 <= docs.length) {
            return docs.slice(start, start + 3);
        }
        return docs.slice(start);
    }, [start, docs]);

    return !documents ? <Loader2 className={'animate-spin w-7 h-7'}/> :
        <>
            {
                docs.length === 0 ? <div className={'italic text-gray-700 font-medium'}>
                        Chưa có những chính sách mới
                    </div> :
                    <>
                        <div
                            className={'w-full flex flex-col gap-6 md:flex-row md:gap-x-6 xl:gap-x-10 h-140 justify-center'}>
                            {
                                documentList.map((item: IPolicyDocument) => {
                                    const detailPath = buildDetailPath(item.title, item._id as string);

                                    return <Link
                                        href={item.link || `/thong-tin-chinh-sach/chinh-sach/chi-tiet/${detailPath}`}
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
                                            <h3 className="text-xl leading-8 line-clamp-2 md:text-4xl md:leading-12 md:line-clamp-6 drop-shadow-md md:mt-5">{item.title}</h3>
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

export default React.memo(DocumentList);
