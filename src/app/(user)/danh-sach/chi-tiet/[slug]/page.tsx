import {buildDetailPath, getIdFromSlug} from "@/lib/utils";
import React from "react";
import PptViewer from "@/components/custom/ppt-viewer";
import PdfViewer from "@/components/custom/pdf-viewer";
import Link from "next/link";
import {cloudinaryService} from "@/service/cloudinary";
import cloudinary from "@/lib/cloudinary";
import {IPost} from "@/models/post";
import OtherPosts from "@/app/(user)/danh-sach/chi-tiet/[slug]/other-posts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchPost(id: string) {
    if (id || id !== 'null') {
        const res = await fetch(`${baseUrl}/api/config/post/${id}`,
            {cache: 'no-store', credentials: 'include'}
        );

        if (!res.ok) {
            throw new Error('Failed to fetch post');
        }
        const data = await res.json();
        let slides: any = [];
        if (data?.post?.slide.url) {
            const parts = data?.post?.slide.url?.split('/');
            const publicId = parts[parts.length - 2] + '/' + parts[parts.length - 1];
            const pages = await cloudinaryService.convertPptxToImages(publicId);
            for (let i = 1; i <= pages; i++) {
                slides.push(cloudinary.url(
                    publicId,
                    {resource_type: "image", format: "jpg", page: i,})
                )
            }
        }

        return {...data.post, slides}
    }
    return null;
}

async function fetchAllPost(key: string) {
    if (key) {
        const res = await fetch(`${baseUrl}/api/config/post/all?key=${key}`,
            {cache: 'no-store', credentials: 'include'}
        );

        if (!res.ok) {
            throw new Error('Failed to fetch posts');
        }
        return res.json();
    }
    return null;
}

export default async function ({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const id: string = getIdFromSlug(slug);
    const post = await fetchPost(id);
    const otherPosts = await fetchAllPost(post.header_key);
    const diffPosts = otherPosts?.posts?.filter(
        (i: any) =>
            i._id !== id &&
            !post?.related_posts?.some((it: any) => (it as IPost)._id === i._id)
    )?.slice(0, 5) || [];
    const relatedPostsIfNotHave = otherPosts?.posts?.filter(
        (i: any) =>
            i._id !== id &&
            !post?.related_posts?.some((it: any) => (it as IPost)._id === i._id))
        ?.map((i: any) => ({...i, is_section_post: false}))
        ?.slice(6, 9) || [];

    return (
        !post ? <div className={'text-gray-500 italic text-center py-40'}>Không có thông tin</div> :
            <div className={'box-border flex flex-col gap-18 mt-10 lg:px-40 md:px-20 px-10 max-sm:px-6 pb-30'}>
                {/* Detail */}
                <div className={'flex flex-col gap-5 2xl:px-50 xl:px-30 px-8'}>
                    <h1 className={'font-medium text-center text-3xl text-green-700'}>{post.title}</h1>
                    <div className={'flex flex-col gap-8'}>
                        {
                            post.text ? <div
                                dangerouslySetInnerHTML={{__html: post.text}}
                                className={'xl:text-justify pr-2 box-border prose'}
                            /> : ''
                        }
                        <div className={'flex flex-col gap-14'}>
                            {
                                post.slide.url ? <div className={'mt-3'}><PptViewer
                                    slides={post.slides} pptUrl={post.slide.url}
                                    downloadNotification={''}
                                    downloadable={post.slide.downloadable}
                                /></div> : ''
                            }
                            {
                                post.pdf.url ? <div className={'mt-3'}>
                                    <PdfViewer url={post.pdf.url} downloadable={post.pdf.downloadable}/>
                                </div> : ''
                            }
                        </div>
                    </div>
                </div>

                {/* Related */}
                {post.header_key === 'knowledge' ?
                    <div className={'flex flex-col gap-14'}>
                        <div className={'flex justify-center w-full'}>
                            <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>Các
                                bài đăng liên quan</h1>
                        </div>
                        <div className={'w-full 2xl:px-60 xl:px-30 lg:px-4'}>
                            <OtherPosts
                                posts={post?.related_posts?.length > 0 ? post?.related_posts : relatedPostsIfNotHave}
                                exceptId={id}
                            />
                        </div>
                    </div> : ''
                }

                {/* Others */}
                <div className={'flex flex-col gap-14'}>
                    <div className={'flex justify-center w-full'}>
                        <h1 className={'font-medium text-center text-2xl w-fit border-t-green-600 text-green-700 border-t-3 pt-2'}>Các
                            bài đăng khác</h1>
                    </div>
                    <div className={'grid grid-cols-1 2xl:px-60 xl:px-30 lg:px-4'}>
                        {
                            diffPosts?.length > 0 ? diffPosts.map((i: IPost, index: number) => (
                                <div
                                    key={i._id}
                                    className={'border-t items-center border-gray-200 box-border pt-3 pb-5 pl-1 pr-4'}
                                >
                                    <Link
                                        className={'hover:text-green-500 text-lg'}
                                        href={post.link || `/danh-sach/chi-tiet/${buildDetailPath(i.title, i._id as string)}`}
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
