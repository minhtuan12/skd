import {getIdFromSlug} from "@/lib/utils";
import Image from "next/image";
import React from "react";
import {IKnowledge} from "@/models/knowledge";
import {fetchDetailKnowledge} from "@/app/(user)/ngan-hang-kien-thuc/(fetch-data)/fetch-detail-knowledge";
import Others from "@/app/(user)/ngan-hang-kien-thuc/chi-tiet/[slug]/others";
import {fetchKnowledge} from "@/app/(user)/ngan-hang-kien-thuc/(fetch-data)/fetch-knowledge";
import {IKnowledgeCategory} from "@/models/knowledge-category";
import PptViewer from "@/components/custom/ppt-viewer";
import PdfViewer from "@/components/custom/pdf-viewer";

export default async function ({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const id: string = getIdFromSlug(slug);
    const item: IKnowledge & { slides: string[] } = await fetchDetailKnowledge(id);
    const others = await fetchKnowledge((item.category as IKnowledgeCategory)._id as string, 0);

    return (
        !item ? <div className={'text-gray-500 italic text-center'}>Không có thông tin</div> :
            <div className={'box-border flex flex-col gap-22 mt-10 lg:px-40 md:px-20 px-10 max-sm:px-6 pb-30'}>
                {/* Detail */}
                <div className={'flex flex-col gap-8 px-5'}>
                    <h1 className={'font-medium text-center text-3xl text-green-700'}>{item.name}</h1>
                    <Image
                        src={item.media?.url as string}
                        alt={item.name} sizes={'100vw'}
                        width={0} height={0}
                        style={{width: '100%', height: '100%'}}
                    />
                    {(item.category as IKnowledgeCategory).name.toUpperCase()}
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
                            item.pdf.url ? <div className={'mt-3'}>
                                <PdfViewer url={item.pdf.url} downloadable={item.pdf.downloadable}/>
                            </div> : ''
                        }
                    </div>
                </div>

                {/* Others */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>Các
                            thông tin liên quan</h1>
                    </div>
                    <div className={'w-full xl:px-14 lg:px-8'}>
                        <Others documents={others} exceptId={id}/>
                    </div>
                </div>
            </div>
    );
}
