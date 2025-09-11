import {buildDetailPath, getIdFromSlug} from "@/lib/utils";
import {IPolicyDocument} from "@/models/policy-document";
import {fetchDetailDocument} from "@/app/(user)/thong-tin-chinh-sach/(fetch-data)/fetch-detail-document";
import Image from "next/image";
import React from "react";
import OtherDocuments from "@/app/(user)/thong-tin-chinh-sach/chinh-sach/chi-tiet/[slug]/other-documents";
import {fetchPolicyDocument} from "@/app/(user)/thong-tin-chinh-sach/(fetch-data)/fetch-policy-document";
import PptViewer from "@/components/custom/ppt-viewer";
import PdfViewer from "@/components/custom/pdf-viewer";
import Link from "next/link";
import {IKnowledgeCategory} from "@/models/knowledge-category";

export default async function ({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const id: string = getIdFromSlug(slug);
    const doc: IPolicyDocument & { slides: string[] } = await fetchDetailDocument(id);
    const otherDocuments = await fetchPolicyDocument(0);
    const diffPosts = otherDocuments?.filter(
        (i: any) =>
            i._id !== id &&
            !doc?.related_posts?.some(it => (it as IPolicyDocument)._id === i._id)
    )?.slice(0, 5) || [];

    return (
        !doc ? <div className={'text-gray-500 italic text-center'}>Không có thông tin</div> :
            <div className={'box-border flex flex-col gap-18 mt-10 lg:px-40 md:px-20 px-10 max-sm:px-6 pb-30'}>
                {/* Detail */}
                <div className={'flex flex-col gap-5 2xl:px-50 xl:px-30 px-8'}>
                    <h1 className={'font-medium text-center text-3xl text-green-700'}>{doc.title}</h1>
                    <div className={'flex flex-col gap-8'}>
                        {
                            doc.text ? <div
                                dangerouslySetInnerHTML={{__html: doc.text}}
                                className={'xl:text-justify pr-2 box-border prose'}
                            /> : ''
                        }
                        <div className={'flex flex-col gap-14'}>
                            {
                                doc.slide.url ? <div className={'mt-3'}><PptViewer
                                    slides={doc.slides} pptUrl={doc.slide.url}
                                    downloadNotification={''}
                                    downloadable={doc.slide.downloadable}
                                /></div> : ''
                            }
                            {
                                doc.pdf.url ? <div className={'mt-3'}>
                                    <PdfViewer url={doc.pdf.url} downloadable={doc.pdf.downloadable}/>
                                </div> : ''
                            }
                        </div>
                    </div>
                </div>

                {/* Related */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>Các
                            văn bản chính sách liên quan</h1>
                    </div>
                    {doc?.related_posts?.length > 0 ?
                        <div className={'w-full 2xl:px-60 xl:px-30 lg:px-4'}>
                            <OtherDocuments documents={otherDocuments} exceptId={id}/>
                        </div>
                        : <i className={'text-gray-500'}>Chưa có các văn bản liên quan</i>
                    }
                </div>

                {/* Others */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>Các
                            văn bản chính sách khác</h1>
                    </div>
                    <div className={'grid grid-cols-1 2xl:px-60 xl:px-30 lg:px-4'}>
                        {
                            diffPosts?.length > 0 ? diffPosts.map((i: IPolicyDocument, index: number) => (
                                <div
                                    key={i._id}
                                    className={'border-t items-center border-gray-200 box-border pt-3 pb-5 pl-1 pr-4'}
                                >
                                    <Link
                                        className={'hover:text-green-500 text-lg'}
                                        href={doc.link || `/thong-tin-chinh-sach/chinh-sach/chi-tiet/${buildDetailPath(i.title, i._id as string)}`}
                                    >
                                        {i.title}
                                    </Link>
                                </div>
                            )) : <i className={'text-gray-500'}>Chưa có thông tin mới</i>
                        }
                    </div>
                </div>
            </div>
    );
}
