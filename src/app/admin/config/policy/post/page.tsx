'use client'

import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Loader2} from "lucide-react";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {Button} from "@/components/ui/button";
import {setBreadcrumb} from "@/redux/slices/admin";
import DataTable from "@/app/admin/config/policy/post/data-table";
import {useFetchSectionAdmin} from "@/app/admin/config/pages/(hooks)/use-section-admin";
import {IPost} from "@/models/post";
import {useFetchPostList} from "@/app/admin/config/policy/(hooks)/use-post-admin";
import Form from "@/app/admin/config/policy/form";
import {ISection, SectionType} from "@/models/section";
import {useAddPost} from "@/app/admin/config/policy/(hooks)/use-add-post";
import {toast} from "sonner";
import {useDeletePost} from "@/app/admin/config/policy/(hooks)/use-delete-post";
import {useUpdatePost} from "@/app/admin/config/policy/(hooks)/use-update-post";
import {useAddPostToSection} from "@/app/admin/config/policy/(hooks)/use-add-post-to-section";

function secureLink(link: string) {
    if (link.includes('https')) return link;
    return link.replace('http', 'https');
}

const defaultItem: IPost = {
    order: 0,
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
    header_key: 'policy'
}

export default function () {
    const [openModal, setOpenModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false);
    const dispatch = useDispatch();
    const [post, setPost] = useState<IPost>(defaultItem);
    const [mediaUrl, setMediaUrl] = useState('');

    const {data: posts, loading: loadingPosts} = useFetchPostList('policy');
    const {data: sections, loading: loadingSections} = useFetchSectionAdmin();
    const {mutate: createPost, loading: loadingAdd} = useAddPost();
    const {mutate: updatePost, loading: loadingUpdate} = useUpdatePost();
    const {mutate: deletePost, loading: loadingDelete} = useDeletePost();
    const {mutate: addPostToSection, loading: loadingAddPostToSection} = useAddPostToSection();
    const {uploadFile, loading: loadingUpload} = useUploadFile();

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
        if (isUpdate) {
            updatePost({...updatedPost}, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                    setOpenModal(false);
                    setIsUpdate(false);
                },
            });
        } else {
            createPost({...updatedPost}, {
                onSuccess: () => {
                    toast.success('Đăng bài thành công');
                    setOpenModal(false);
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

    const handleAddDownload = () => {
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
                image_url: secureLink(e)
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

    const handleClickEdit = (item: IPost) => {
        setIsUpdate(true);
        setPost(item);
        setOpenModal(true);
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

    const handleDelete = (id: string) => {
        if (id) {
            deletePost(id, {
                onSuccess: () => {
                    toast.success('Xóa thành công')
                }
            });
        }
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Thông tin chính sách', href: ''},
        ]))
    }, [])

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Quản lý bài đăng</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                {openModal ? <div className={'flex gap-4'}>
                        <Button
                            onClick={() => {
                                setPost(defaultItem);
                                setOpenModal(false);
                            }} size={'lg'}
                        >
                            Quay lại
                        </Button>
                        <Button onClick={handleSubmit} size={'lg'} disabled={loadingUpload || loadingAdd || loadingUpdate}>
                            {(loadingUpload || loadingAdd || loadingUpdate) &&
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Lưu bài đăng
                        </Button>
                    </div>
                    : <Button onClick={() => {
                        setIsUpdate(false);
                        setPost(defaultItem);
                        setOpenModal(true);
                    }} size={'lg'}>
                        Đăng bài
                    </Button>
                }
            </div>
        </div>
        {(loadingPosts || loadingSections || loadingAddPostToSection) ? <Loader2 className={'animate-spin'}/> :
            !openModal ?
                <DataTable
                    data={(Array.from(
                        new Map(posts?.posts.map((p: any) => [p._id.toString(), p])).values()
                    )) as any || []}
                    sections={sections?.sections?.filter((i: ISection) => i.type === SectionType.list
                        && i.header_key === 'policy'
                    ) || []}
                    addPostToSection={addPostToSection}
                    handleClickUpdate={handleClickEdit}
                    handleClickDelete={handleDelete}
                    loadingDelete={loadingDelete}
                /> :
                <Form
                    isOnePost={false}
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
        }
    </>
}
