import {buildDetailPath, getIdFromSlug} from "@/lib/utils";
import React from "react";
import {IKnowledge} from "@/models/knowledge";
import {fetchDetailKnowledge} from "@/app/(user)/ngan-hang-kien-thuc/(fetch-data)/fetch-detail-knowledge";
import Others from "@/app/(user)/ngan-hang-kien-thuc/chi-tiet/[slug]/others";
import {fetchKnowledge} from "@/app/(user)/ngan-hang-kien-thuc/(fetch-data)/fetch-knowledge";
import {IKnowledgeCategory} from "@/models/knowledge-category";
import PptViewer from "@/components/custom/ppt-viewer";
import PdfViewer from "@/components/custom/pdf-viewer";
import Link from "next/link";

export default async function ({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const id: string = getIdFromSlug(slug);
    const item: IKnowledge & { slides: string[] } = await fetchDetailKnowledge(id);
    const others = await fetchKnowledge((item.category[0] as IKnowledgeCategory)._id as string, 0);
    const diffPosts = others?.filter(
        (i: any) =>
            i._id !== id &&
            !item?.related_posts?.some(it => (it as IKnowledge)._id === i._id)
    )?.slice(0, 5) || [];
    return (
        !item ? <div className={'text-gray-500 italic text-center'}>Không có thông tin</div> :
            <div className={'box-border flex flex-col gap-18 mt-10 lg:px-40 md:px-20 px-10 max-sm:px-6 pb-30'}>
                {/* Detail */}
                <div className={'flex flex-col gap-8 2xl:px-50 xl:px-30 px-8'}>
                    <h1 className={'font-medium text-center text-3xl text-green-700'}>{item.name}</h1>
                    <div className={'text-center -mt-5'}>{(item.category as IKnowledgeCategory[]).map(i => i.name.toUpperCase()).join(', ')}</div>
                    <div className={'flex flex-col gap-4'}>
                        <div className={'flex flex-col gap-8'}>
                            {
                                item.text ? <div
                                    dangerouslySetInnerHTML={{__html: item.text}}
                                    className={'xl:text-justify pr-2 box-border prose'}
                                /> : ''
                            }
                            <div className={'flex flex-col gap-14'}>
                                {
                                    item.slide.url ? <div className={'mt-3'}><PptViewer
                                        slides={item.slides} pptUrl={item.slide.url}
                                        downloadNotification={''}
                                        downloadable={item.slide.downloadable}
                                    /></div> : ''
                                }
                                {
                                    item.pdf.url ? <div className={'mt-3 px-60'}>
                                        <PdfViewer url={item.pdf.url} downloadable={item.pdf.downloadable}/>
                                    </div> : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>Các
                            thông tin liên quan</h1>
                    </div>
                    {
                        item?.related_posts?.length > 0 ? <div className={'w-full 2xl:px-60 xl:px-30 lg:px-4'}>
                            <Others documents={item?.related_posts || []} exceptId={id}/>
                        </div> : <i className={'text-gray-500 text-center'}>Chưa có các thông tin liên quan</i>
                    }
                </div>

                {/* Others */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>Các
                            thông tin khác</h1>
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
                                        href={item.link || `/ngan-hang-kien-thuc/chi-tiet/${buildDetailPath(i.name, i._id as string)}`}
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
