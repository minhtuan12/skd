import React from "react";
import {Pagination, PaginationContent, PaginationItem, PaginationLink} from "@/components/ui/pagination";
import {ChevronRight} from "lucide-react";
import PostCard from './card';
import {IPost} from "@/models/post";
import {SectionType} from "@/models/section";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchDetailSection(id: string) {
    if (id) {
        const res = await fetch(`${baseUrl}/api/config/section/${id}`,
            {cache: 'no-store', credentials: 'include'}
        );

        if (!res.ok) {
            throw new Error('Failed to fetch detail section');
        }

        const result = await res.json();
        return result.section || null;
    }
}

async function fetchPostsByListId(id: string, page: number) {
    if (id) {
        const res = await fetch(`${baseUrl}/api/config/post/section/${id}?page=${page}`,
            {cache: 'no-store', credentials: 'include'}
        );

        if (!res.ok) {
            throw new Error('Failed to fetch posts by section');
        }

        const result = await res.json();
        return result.posts || null;
    }
}

export default async function ({params}: { params: Promise<{ sectionId: string, trang: string }> }) {
    const {sectionId, trang} = await params;
    const page = parseInt(trang || '1');
    const section = await fetchDetailSection(sectionId);
    const result = await fetchPostsByListId(sectionId, page);

    return <div className={'box-border flex flex-col gap-8 mt-10 lg:px-30 px-10 max-sm:px-6 pb-30'}>
        <div className={'flex flex-col gap-8 px-5'}>
            <h1 className={'font-semibold text-center text-xl'}>{section?.name?.toUpperCase() || ''}</h1>
            <div className={'flex gap-12 flex-col'}>
                <div className={`w-full grid grid-cols-1 md:grid-cols-2 ${section.header_key === 'policy' ? 'lg:grid-cols-5' : 'lg:grid-cols-3'} gap-y-16 gap-x-7`}>
                    {
                        result.data.map((item: IPost) => (
                            <PostCard
                                section={section}
                                className={'cursor-pointer'}
                                key={item._id}
                                item={item}
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
                                    href={`/danh-sach/${sectionId}/${i + 1}`}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationLink href={page < result.totalPages ?
                                `/danh-sach/${sectionId}/${page + 1}` : ''}
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
