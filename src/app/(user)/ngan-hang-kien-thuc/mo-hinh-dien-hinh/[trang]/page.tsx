import React from "react";
import {Pagination, PaginationContent, PaginationItem, PaginationLink} from "@/components/ui/pagination";
import {ChevronRight} from "lucide-react";
import {fetchKnowledge} from "@/app/(user)/ngan-hang-kien-thuc/(fetch-data)/fetch-knowledge";
import {IKnowledge, KnowledgeTypes} from "@/models/knowledge";
import KnowledgeCard from "@/app/(user)/ngan-hang-kien-thuc/knowledge-card";

export default async function MoHinhDienHinh({params}: { params: Promise<{ trang: string }> }) {
    const {trang} = await params;
    const page = parseInt(trang || '1');
    const result = await fetchKnowledge(KnowledgeTypes.model, page);

    return <div className={'box-border flex flex-col gap-8 mt-10 lg:px-30 px-10 max-sm:px-6 pb-30'}>
        <div className={'flex flex-col gap-8 px-5'}>
            <h1 className={'font-semibold text-center text-xl'}>MÔ HÌNH ĐIỂN HÌNH</h1>
            <div className={'flex gap-12 flex-col'}>
                <div className={'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-7'}>
                    {
                        result.data.map((item: IKnowledge) => (
                            <KnowledgeCard
                                className={'cursor-pointer'}
                                key={item._id}
                                knowledge={item}
                                // imageHeight={265}
                            />
                        ))
                    }
                </div>
                <Pagination className={'justify-end'}>
                    <PaginationContent>
                        {Array.from({length: result?.totalPages}, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    isActive={page === i + 1}
                                    href={`/ngan-hang-kien-thuc/mo-hinh-dien-hinh/${i + 1}`}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationLink href={page < result.totalPages ?
                                `/ngan-hang-kien-thuc/mo-hinh-dien-hinh/${page + 1}` : ''}
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
