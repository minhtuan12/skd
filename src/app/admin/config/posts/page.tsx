'use client'

import React, {useEffect, useState} from "react";
import {setBreadcrumb} from "@/redux/slices/admin";
import {useDispatch} from "react-redux";
import {Loader2} from "lucide-react";
import {toast} from "sonner";
import {IPost} from "@/models/post";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useFetchPostAdmin} from "@/app/admin/config/posts/(hooks)/use-post-admin";
import {useAddPost} from "@/app/admin/config/posts/(hooks)/use-add-post";
import {useUpdatePost} from "@/app/admin/config/posts/(hooks)/use-update-post";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {Button} from "@/components/ui/button";
import Form from "@/app/admin/config/posts/form";

const defaultItem = {
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
    video_url: ''
}

const pages = [
    {name: 'Thông tin chính sách', key: 'policy'},
    {name: 'Ngân hàng kiến thức', key: 'knowledge'},
    {name: 'Bản đồ', key: 'map'},
    {name: 'Tin tức sự kiện', key: 'news'},
    {name: 'Hỏi đáp liên hệ', key: 'contact'},
    {name: 'Giới thiệu', key: 'introduction'},
]

function secureLink(link: string) {
    if (link.includes('https')) return link;
    return link.replace('http', 'https');
}

export default function () {
    const dispatch = useDispatch();

    const [post, setPost] = useState<IPost>(defaultItem as any);
    const [mediaUrl, setMediaUrl] = useState('');
    const [modalTitle, setModalTitle] = useState(`Thêm mới`);
    const [page, setPage] = useState<string | undefined>(undefined);
    const [selectedPost, setSelectedPost] = useState<string | undefined>(undefined);

    const {loading: loadingPost, data: posts} = useFetchPostAdmin(page);
    const {loading: loadingAddPost, mutate: addPost} = useAddPost();
    const {loading: loadingUpdatePost, mutate: updatePost} = useUpdatePost();
    const {uploadFile, loading} = useUploadFile();

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
            addPost({...updatedPost, sectionId: selectedPost}, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
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
                        if (file.key === 'image_url') {
                            clone = {
                                ...clone,
                                image_url: secureLink(file.url)
                            }
                        } else if (parent !== 'file_url') {
                            clone = {
                                ...clone,
                                [parent]: {
                                    ...clone[parent as keyof typeof clone] as any,
                                    [child]: secureLink(file.url)
                                }
                            }
                        } else {
                            clone = {
                                ...clone,
                                downloads: [
                                    ...clone.downloads.slice(0, Number(child)),
                                    {...clone.downloads[Number(child)], file_url: secureLink(file.url)},
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

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Quản lý bài viết'}
        ]))
    }, []);

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Quản lý bài viết</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                <Button onClick={handleSubmit}
                        disabled={loadingUpdatePost || loading || loadingAddPost || !selectedPost || !page}>
                    {(loadingUpdatePost || loading || loadingAddPost) &&
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Cập nhật
                </Button>
            </div>
        </div>
        <div className={'flex items-center gap-6'}>
            <div className={'flex flex-col gap-2'}>
                <p className={'font-medium'}>Chọn trang</p>
                <Select value={page} onValueChange={(value) => {
                    setSelectedPost(undefined);
                    setPage(value as string)
                }}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Chọn trang"/>
                    </SelectTrigger>
                    <SelectContent>
                        {pages.map((item: any) => (
                            <SelectItem key={item.key} value={item.key}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className={'flex flex-col gap-2'}>
                <p className={'font-medium'}>Chọn bài viết</p>
                <Select value={selectedPost} onValueChange={(value) => {
                    setSelectedPost(value as string);
                    const p = posts?.posts?.find((i: any) => i._id === value).post_id;
                    setPost(p || defaultItem);
                }}>
                    <SelectTrigger className="w-[280px] bg-white" disabled={!page}>
                        <SelectValue placeholder="Chọn bài viết"/>
                    </SelectTrigger>
                    <SelectContent>
                        {posts?.posts ? posts.posts.map((item: any) => (
                            <SelectItem key={item._id} value={item._id}>
                                {item.name}
                            </SelectItem>
                        )) : ''}
                    </SelectContent>
                </Select>
            </div>
        </div>
        {(selectedPost && page) ? <Form
            handleChangeData={handleChangeData}
            handleChangeCheck={handleChangeCheck}
            handleChangeFile={handleChangeFile}
            handleChangeDownloads={handleChangeDownloads}
            handleChangeFilee={handleChangeFilee}
            post={post}
            setPost={setPost}
        /> : ''}
    </>
}
