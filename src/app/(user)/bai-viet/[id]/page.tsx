import React from "react";
import PdfViewer from "@/components/custom/pdf-viewer";
import {VideoPlayer} from "@/components/ui/video";
import PptViewer from "@/components/custom/ppt-viewer";
import {cloudinaryService} from "@/service/cloudinary";
import cloudinary from "@/lib/cloudinary";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchPost(id: string) {
    if (id || id !== 'null') {
        const res = await fetch(`${baseUrl}/api/config/post?id=${id}`,
            {cache: 'no-store', credentials: 'include'}
        );

        if (!res.ok) {
            throw new Error('Failed to fetch post');
        }
        const data = await res.json();
        const parts = data?.post?.post_id?.slide.url?.split('/');
        const publicId = parts[parts.length - 2] + '/' + parts[parts.length - 1];
        const pages = await cloudinaryService.convertPptxToImages(publicId);
        let slides = [];
        for (let i = 1; i <= pages; i++) {
            slides.push(cloudinary.url(
                publicId,
                {resource_type: "image", format: "jpg", page: i,})
            )
        }

        return {...data, post: {...data.post, post_id: {...data.post.post_id, slides}}}
    }
    return null;
}

export default async function ({params}: {
    params: Promise<{ id: string }>,
}) {
    const {id} = await params;
    const {post: data} = await fetchPost(id);
    const post = data.post_id;

    return !post ? <div className={'text-gray-500 italic text-center py-40'}>Không có thông tin</div> :
        <div className={'box-border flex flex-col gap-18 mt-10 lg:px-40 md:px-20 px-10 max-sm:px-6 pb-30'}>
            {/* Detail */}
            <div className={'flex flex-col gap-8 2xl:px-50 xl:px-30 px-8'}>
                <h1 className={'font-medium text-center text-3xl text-green-700'}>{data.name}</h1>
                <div className={'flex flex-col gap-4'}>
                    <div className={'flex flex-col gap-8'}>
                        {
                            post.text ? <div
                                dangerouslySetInnerHTML={{__html: post.text}}
                                className={'xl:text-justify pr-2 box-border prose'}
                            /> : ''
                        }
                        <div className={'flex flex-col gap-14'}>
                            {
                                post.slide.url ? <div className={'mt-3'}>
                                    <PptViewer
                                        slides={post.slides} pptUrl={post.slide.url}
                                        downloadNotification={''}
                                        downloadable={post.slide.downloadable}
                                        downloads={[]}
                                    />
                                </div> : ''
                            }
                            {
                                post.pdf.url ? <div className={'mt-3'}>
                                    <PdfViewer url={post.pdf.url} downloadable={post.pdf.downloadable}/>
                                </div> : ''
                            }
                            {
                                post.video_url ? <div className={'mt-3 px-20'}>
                                    <VideoPlayer src={post.video_url}/>
                                </div> : ''
                            }
                            <div className={'flex flex-col gap-1 justify-start'}>
                                {
                                    (post.downloads && post.downloads?.length > 0) ? post.downloads.map((item: any, index: number) => (
                                        <a
                                            key={index}
                                            className={'underline flex justify-start mt-2 text-lg text-blue-600 w-fit cursor-pointer'}
                                            href={item.file_url}
                                        >
                                            Tải xuống {item.name}
                                        </a>
                                    )) : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
}
