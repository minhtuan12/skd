import React from "react";
import {ISection, SectionType} from "@/models/section";
import {buildDetailPath, cn} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {IKnowledgeCategory} from "@/models/knowledge-category";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchKnowledgeCategory() {
    const res = await fetch(`${baseUrl}/api/config/knowledge-category`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch knowledge category');
    }
    return res.json();
}

async function fetchMenu() {
    const res = await fetch(`${baseUrl}/api/config/global`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch menu');
    }
    return res.json();
}

function generateUrl(item: any) {
    if (item.type === SectionType.section) {
        return `/muc-luc/${item.header_key}?sub=${item._id}`;
    }
    if (item.type === SectionType.post) {
        return item.post_id ? `/bai-viet/${item.post_id}` : '/';
    }
    switch (item.header_key) {
        case 'policy':
            return '/thong-tin-chinh-sach/chinh-sach/1'
        case 'map':
            if (item.name === 'Bản đồ đất') {
                return '/ban-do/ban-do-dat';
            }
            return '/ban-do/cac-trung-tam-quan-trac-dat';
        case 'knowledge':
            return `/ngan-hang-kien-thuc/${buildDetailPath(item.name, item._id as string)}/1`;
        case 'news':
            if (item.name === 'Nghiên cứu') return '/tin-tuc-va-su-kien/nghien-cuu/1';
            return '/tin-tuc-va-su-kien/tin-tuc-su-kien';
        default:
            return '/';
    }
}

export default async function ({params, searchParams}: {
    params: Promise<{ key: string }>,
    searchParams: Promise<{ sub?: string }>
}) {
    const {key} = await params;
    const {sub} = await searchParams;
    let menu = [];
    if (key === 'knowledge') {
        const data = await fetchKnowledgeCategory();
        menu = data.pages.map((page: IKnowledgeCategory) => {
            return {
                ...page,
                name: page.name,
                type: SectionType.list,
                header_key: 'knowledge'
            }
        })
    } else {
        const data = await fetchMenu();
        if (sub) {
            menu = data.menu.filter((i: ISection) => i.parent_id === sub && !i.is_deleted);
        } else {
            menu = data.menu.filter((i: ISection) => i.header_key === key && !i.parent_id && !i.is_deleted);
        }
    }

    return <div className={'box-border flex flex-col gap-8 mt-10 lg:px-30 px-10 max-sm:px-6 pb-30'}>
        <div className={'flex flex-col gap-8 px-5'}>
            <h1 className={'font-semibold text-center text-xl'}>MỤC LỤC</h1>
            <div className={'flex gap-12 flex-col'}>
                <div className={'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-7'}>
                    {
                        menu.map((item: ISection, index: number) => (
                            <Link
                                key={index}
                                href={generateUrl(item)}
                                className={cn('flex flex-col gap-4')}
                            >
                                <div
                                    className={cn(`rounded-md 2xl:h-[265px] xl:h-[200px] md:h-[150px] border border-gray-300`)}>
                                    <Image
                                        src={item?.image_url as string || '/logos/principles.png'}
                                        alt={item.name as string}
                                        width={0}
                                        height={0}
                                        style={{width: '100%', height: '100%'}}
                                        sizes="100vw"
                                        className={`rounded-md ${item.image_url ? 'object-cover' : 'object-contain'}`}
                                    />
                                </div>
                                <div className={'flex flex-col gap-0.5 flex-1 box-border pl-1'}>
                                    <h1 className={'text-lg font-medium text-green-700 line-clamp-4'}>{item.name}</h1>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
}
