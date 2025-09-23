'use client'

import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {setBreadcrumb} from "@/redux/slices/admin";
import {Loader2} from "lucide-react";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {Button} from "@/components/ui/button";
import DataTable from "@/app/admin/config/policy/[id]/data-table";
import Form from "@/app/admin/config/policy/form";
import {toast} from "sonner";
import {IPost} from "@/models/post";
import {useAddPost} from "@/app/admin/config/posts/(hooks)/use-add-post";
import {useUpdatePost} from "@/app/admin/config/posts/(hooks)/use-update-post";
import {useFetchSectionAdmin} from "@/app/admin/config/pages/(hooks)/use-detail-section";
import {SectionType} from "@/models/section";
import {useFetchPostList} from "@/app/admin/config/policy/(hooks)/use-post-admin";
import {useUpdatePostOrder} from "@/app/admin/config/policy/(hooks)/use-change-post-order";

const defaultItem: IPost = {
    title: '',
    text: '',
    slide: {
        url: '',
        downloadable: true,
    },
    pdf: {
        url: '',
        downloadable: true,
    },
    downloads: [{name: '', file_url: ''}],
    link: '',
    video_url: '',
    image_url: '',
    related_posts: [],
    header_key: 'policy',
    order: 0
}

export default function ({params}: { params: Promise<{ id: string }> }) {
    const {id} = React.use(params);
    const [post, setPost] = useState<IPost>(defaultItem as any);
    const [mediaUrl, setMediaUrl] = useState('');

    const {loading: loadingDetailSection, data} = useFetchSectionAdmin(id);
    const {loading: loadingPostList, data: posts} = useFetchPostList('policy');
    const {loading: loadingAddPost, mutate: addPost} = useAddPost();
    const {loading: loadingUpdatePost, mutate: updatePost} = useUpdatePost();
    const {uploadFile, loading: loadingUpload} = useUploadFile();
    const {loading: loadingOrder, mutate: changeOrder} = useUpdatePostOrder('policy');

    const dispatch = useDispatch();

    const handleChangeData = (value: any, key: string) => {
        if (key === 'media') {
            setPost((prev: any) => ({
                ...prev,
                media: {
                    ...prev.media,
                    url: value
                }
            }))
        } else {
            setPost((prev: any) => ({
                ...prev,
                [key]: value
            }))
        }
    }

    const handleSubmitPost = (post: any) => {
        const updatedPost = {
            ...post,
            text: post.link ? '' : post.text,
            slide: {
                ...post.slide,
                url: post.link ? null : post.slide.url
            },
            pdf: {
                ...post.pdf,
                url: post.link ? null : post.pdf.url
            },
            downloads: post.downloads.filter((i: any) => i.file_url)
        }
        if (updatedPost?._id) {
            updatePost({...updatedPost}, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                },
            });
        } else {
            addPost({...updatedPost, sectionId: id}, {
                onSuccess: () => {
                    toast.success('Đăng bài thành công');
                },
            });
        }
    }

    const handleUploadFiles = () => {
        const formData = new FormData();
        let uploadFiles = [
            {
                file: post.image_url,
                key: `image_url`,
                type: 'image'
            },
            {
                file: post.slide.url,
                key: "slide.url",
                type: 'raw',
            },
            {
                file: post.pdf.url,
                key: "pdf.url",
                type: 'pdf',
            },
            ...post.downloads.map((i: any, index: number) => ({
                file: i.file_url,
                key: `file_url.${index}`,
                type: 'raw'
            }))
        ]
        uploadFiles = uploadFiles.filter(item => (item.file && typeof item.file !== 'string'));
        if (post.link) {
            handleSubmitPost(post);
            return;
        }
        if (uploadFiles.length > 0) {
            uploadFiles.forEach(uploadFile => {
                formData.append('file', uploadFile.file as File);
                formData.append('key', uploadFile.key);
                formData.append('type', uploadFile.type as string);
            })

            uploadFile(formData, {
                onSuccess: (res) => {
                    let clone = post;
                    const files = res.data;
                    for (let file of files) {
                        const [parent, child] = file.key.split('.');
                        if (parent !== 'file_url') {
                            clone = {
                                ...clone,
                                [parent]: {
                                    ...clone[parent as keyof typeof clone] as any,
                                    [child]: file.url
                                }
                            }
                        } else {
                            clone = {
                                ...clone,
                                downloads: [
                                    ...clone.downloads.slice(0, Number(child)),
                                    {...clone.downloads[Number(child)], file_url: file.url},
                                    ...clone.downloads.slice(Number(child) + 1)
                                ] as any
                            }
                        }
                    }
                    handleSubmitPost(clone);
                },
            })
        } else {
            handleSubmitPost(post);
        }
    }

    const handleSubmit = () => {
        handleUploadFiles();
    }

    const handleChangeCheck = (checked: boolean, key: string) => {
        setPost({
            ...post,
            [key]: {
                ...post[key as keyof typeof post] as any,
                downloadable: checked
            }
        })
    }

    const handleChangeFile = (file: any, key: string) => {
        setPost({
            ...post,
            [key]: {
                ...post[key as keyof typeof post] as any,
                url: file
            }
        })
    }

    const handleChangeDownloads = (value: any, key: string, index: number) => {
        setPost({
            ...post,
            downloads: [
                ...post.downloads.slice(0, index),
                {
                    ...post.downloads[index],
                    [key]: value
                },
                ...post.downloads.slice(index + 1)
            ] as any
        })
    }

    const handleAddDownload = () => {
        {
            setPost({
                ...post,
                downloads: [
                    ...post.downloads,
                    {
                        name: '',
                        file_url: ''
                    }
                ] as any
            })
        }
    }

    const handleChangeImage = (e: any) => {
        if (typeof e !== 'string') {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onloadend = () => {
                    setPost((prev: any) => ({
                        ...prev,
                        image_url: file
                    }))
                    setMediaUrl(reader.result as string);
                }
                reader.readAsDataURL(file)
            }
        } else {
            setPost((prev: any) => ({
                ...prev,
                image_url: e
            }))
            setMediaUrl(e as string);
        }
    }

    const handleChangeFilee = (file: any, index: number) => {
        setPost({
            ...post,
            downloads: [
                ...post.downloads.slice(0, index),
                {
                    ...post.downloads[index],
                    file_url: file
                },
                ...post.downloads.slice(index + 1)
            ] as any
        })
    }

    const handleSelectRelatedPosts = (checked: boolean, itemId: string) => {
        setPost((prev: any) => ({
            ...prev,
            related_posts: !checked ?
                prev.related_posts.filter((i: string) => i !== itemId) :
                [...prev.related_posts, itemId]
        }))
    }

    const handleDeleteDownload = (index: number) => {
        setPost({
            ...post,
            downloads: [
                ...post.downloads.slice(0, index),
                ...post.downloads.slice(index + 1)
            ] as any
        })
    }

    function handleChangeOrder(postId: string, oldOrder: number, newOrder: number) {
        if (oldOrder === newOrder) {
            return;
        }
        changeOrder({postId, sectionId: id, oldOrder, newOrder}, {
            onSuccess: () => {
                toast.success('Cập nhật thành công');
            }
        })
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Thông tin chính sách'}
        ]))
    }, []);

    useEffect(() => {
        if (data?.section?.type === SectionType.post) {
            setPost(data.section.post_id || defaultItem);
        }
    }, [data]);

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">{data?.section?.name || ''}</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                {
                    data?.section?.type === SectionType.post ?
                        <Button
                            onClick={handleSubmit} size={'lg'}
                            disabled={loadingUpload || loadingAddPost || loadingUpdatePost}
                        >
                            {(loadingUpload || loadingAddPost || loadingUpdatePost) &&
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Lưu bài đăng
                        </Button> : ''
                }
            </div>
        </div>
        {
            loadingDetailSection || loadingPostList ? <Loader2 className={'animate-spin'}/> : (
                data?.section?.type === SectionType.list ? (
                    <DataTable
                        data={posts?.posts?.filter((i: any) => data?.section?.post_ids?.includes(i._id)) || []}
                        handleChangeOrder={handleChangeOrder}
                    />
                ) : <Form
                    isOnePost={true}
                    handleChangeFile={handleChangeFile}
                    post={post}
                    imageUrl={mediaUrl}
                    handleChangeData={handleChangeData}
                    handleImageChange={handleChangeImage}
                    handleChangeCheck={handleChangeCheck}
                    handleSelectRelatedPosts={handleSelectRelatedPosts}
                    handleAddDownload={handleAddDownload}
                    handleChangeDownloads={handleChangeDownloads}
                    handleDeleteDownload={handleDeleteDownload}
                    handleChangeFilee={handleChangeFilee}
                />
            )
        }
    </>
}
