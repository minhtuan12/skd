import {getIdFromSlug} from "@/lib/utils";
import {IPolicyDocument} from "@/models/policy-document";
import {fetchDetailDocument} from "@/app/(user)/thong-tin-chinh-sach/(fetch-data)/fetch-detail-document";
import Image from "next/image";
import React from "react";
import OtherDocuments from "@/app/(user)/thong-tin-chinh-sach/chinh-sach/chi-tiet/[slug]/other-documents";
import {fetchPolicyDocument} from "@/app/(user)/thong-tin-chinh-sach/(fetch-data)/fetch-policy-document";

export default async function ({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const id: string = getIdFromSlug(slug);
    const doc: IPolicyDocument = await fetchDetailDocument(id);
    const otherDocuments = await fetchPolicyDocument(0);

    return (
        !doc ? <div className={'text-gray-500 italic text-center'}>Không có thông tin</div> :
            <div className={'box-border flex flex-col gap-18 mt-10 lg:px-40 md:px-20 px-10 max-sm:px-6 pb-30'}>
                {/* Detail */}
                <div className={'flex flex-col gap-8 px-5'}>
                    <h1 className={'font-medium text-center text-3xl text-green-700'}>{doc.title}</h1>
                    <Image
                        src={doc.image_url as string}
                        alt={doc.title} sizes={'100vw'}
                        width={0} height={0}
                        style={{width: '100%', height: '100%'}}
                    />
                    <div dangerouslySetInnerHTML={{__html: doc.description.content}} className={'xl:text-justify pr-2 box-border prose'}/>
                </div>

                {/* Others */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>Các văn bản chính sách liên quan</h1>
                    </div>
                    <div className={'w-full xl:px-14 lg:px-8'}>
                        <OtherDocuments documents={otherDocuments} exceptId={id}/>
                    </div>
                </div>
            </div>
    );
}
