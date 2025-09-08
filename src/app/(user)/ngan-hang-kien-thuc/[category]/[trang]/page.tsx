import React from "react";
import {Pagination, PaginationContent, PaginationItem, PaginationLink} from "@/components/ui/pagination";
import {ChevronRight} from "lucide-react";
import {fetchKnowledge} from "@/app/(user)/ngan-hang-kien-thuc/(fetch-data)/fetch-knowledge";
import {IKnowledge} from "@/models/knowledge";
import KnowledgeCard from "@/app/(user)/ngan-hang-kien-thuc/knowledge-card";
import {buildDetailPath, getIdFromSlug} from "@/lib/utils";
import {fetchKnowledgeCategory} from "@/app/(user)/ngan-hang-kien-thuc/(fetch-data)/fetch-knowledge-category";
import CategorySelect from "@/app/(user)/ngan-hang-kien-thuc/[category]/[trang]/category-select";

export default async function ({params, searchParams}: {
    params: Promise<{ category: string, trang: string }>,
    searchParams: Promise<{ sub?: string }>
}) {
    const {category, trang} = await params;
    const {sub} = await searchParams;
    const page = parseInt(trang || '1');
    const categoryId = getIdFromSlug(category);
    const filterId = sub || categoryId;
    const result = await fetchKnowledge(filterId, page);
    const cat = await fetchKnowledgeCategory(categoryId);

    return categoryId ? <div className={'box-border flex flex-col gap-8 mt-10 lg:px-30 px-10 max-sm:px-6 pb-30'}>
        <div className={'flex flex-col gap-8 px-5'}>
            <h1 className={'font-semibold text-center text-xl'}>{cat.name.toUpperCase()}</h1>
            {/* Filter */}
            {
                cat?.children?.length > 0 ? <div className={'flex items-center gap-4 text-lg'}>
                    Lọc theo nhóm vấn đề:
                    <CategorySelect cat={cat} value={sub}/>
                </div> : ''
            }
            <div className={'flex gap-12 flex-col'}>
                {
                    result.data.length > 0 ?
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
                        </div> : <div className={'italic text-gray-500 text-xl text-center w-full'}>
                            Chưa có thông tin
                        </div>
                }
                {
                    result.data.length > 0 ? <Pagination className={'justify-end'}>
                        <PaginationContent>
                            {Array.from({length: result?.totalPages}, (_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={page === i + 1}
                                        href={`/ngan-hang-kien-thuc/${buildDetailPath(cat.name, categoryId)}/${i + 1}`}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationLink href={page < result.totalPages ?
                                    `/ngan-hang-kien-thuc/${buildDetailPath(cat.name, categoryId)}/${page + 1}` : ''}
                                >
                                    <ChevronRight/>
                                </PaginationLink>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination> : ''
                }
            </div>
        </div>
    </div> : null
}
