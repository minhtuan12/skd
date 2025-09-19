'use client'

import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setBreadcrumb} from "@/redux/slices/admin";
import {Loader2} from "lucide-react";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {Button} from "@/components/ui/button";
import {IKnowledge} from "@/models/knowledge";
import {useFetchKnowledge} from "@/app/admin/config/(hooks)/use-knowledge";
import DataTable from "@/app/admin/config/knowledge/[category]/data-table";
import KnowledgeForm from "@/app/admin/config/knowledge/form";
import {toast} from "sonner";
import {useUpdateKnowledge} from "@/app/admin/config/(hooks)/use-update-knowledge";
import {RootState} from "@/redux/store";
import {useFetchSubCategory} from "@/app/admin/config/(hooks)/use-sub-category";
import {useUpdateKnowledgeOrder} from "@/app/admin/config/(hooks)/use-update-knowledge-order";

const defaultItem: IKnowledge = {
    name: '',
    category: [],
    media: {
        url: '',
        media_type: 'image'
    },
    text: '',
    slide: {
        url: null,
        downloadable: true
    },
    pdf: {
        url: null,
        downloadable: true
    },
    link: null,
    related_posts: [],
    video_url: ''
}

export default function ({params}: { params: Promise<{ category: string }> }) {
    const {category: categoryId} = React.use(params);
    const [openModal, setOpenModal] = useState(false);
    const pageTitle = useSelector((state: RootState) => state.admin.knowledgePageTitle);
    const dispatch = useDispatch();

    const {error, refetch, loading, data} = useFetchKnowledge(categoryId);
    const {mutate: updateKnowledge, loading: loadingUpdate} = useUpdateKnowledge(categoryId);
    const {mutate: changeOrder, loading: loadingOrder} = useUpdateKnowledgeOrder(categoryId);
    const {uploadFile, loading: loadingUpload} = useUploadFile();
    const {data: subCategories} = useFetchSubCategory(categoryId);

    const [newKnowledge, setNewKnowledge] = useState<IKnowledge>(defaultItem);
    const [mediaUrl, setMediaUrl] = useState('');
    const [modalTitle, setModalTitle] = useState(`Thêm mới`)

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Ngân hàng kiến thức', href: ''},
        ]))
    }, [])

    const handleChangeImage = (e: any, key: string, index = -1) => {
        if (typeof e !== 'string') {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onloadend = () => {
                    setNewKnowledge((prev: any) => ({
                        ...prev,
                        media: {
                            media_type: 'image',
                            url: file
                        }
                    }))
                    setMediaUrl(reader.result as string);
                }
                reader.readAsDataURL(file)
            }
        } else {
            setNewKnowledge((prev: any) => ({
                ...prev,
                media: {
                    media_type: 'image',
                    url: e
                }
            }))
            setMediaUrl(e as string);
        }
    }

    const handleChangeData = (value: any, key: string) => {
        if (key === 'media') {
            setNewKnowledge((prev: any) => ({
                ...prev,
                media: {
                    ...prev.media,
                    url: value
                }
            }))
        } else {
            setNewKnowledge((prev: any) => ({
                ...prev,
                [key]: value
            }))
        }
    }

    // call api add knowledge
    const handleSubmitKnowledge = (newKnowledge: any) => {
        const updatedKnowledge = {
            ...newKnowledge,
            name: newKnowledge.name.trim(),
            text: newKnowledge.link ? '' : newKnowledge.text,
            slide: {
                ...newKnowledge.slide,
                url: newKnowledge.link ? null : newKnowledge.slide.url
            },
            pdf: {
                ...newKnowledge.pdf,
                url: newKnowledge.link ? null : newKnowledge.pdf.url
            }
        }
        if (modalTitle.includes('Cập nhật')) {
            updateKnowledge(updatedKnowledge, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                    setOpenModal(false);
                },
            });
        }
    }

    // call api upload files
    const handleUploadFiles = () => {
        const formData = new FormData();
        let uploadFiles = [
            {
                file: newKnowledge.media?.url,
                key: `media.url`,
                type: newKnowledge.media?.media_type,
            },
            {
                file: newKnowledge.slide.url,
                key: "slide.url",
                type: 'raw',
            },
            {
                file: newKnowledge.pdf.url,
                key: "pdf.url",
                type: 'pdf',
            },
        ]
        uploadFiles = uploadFiles.filter(item => (item.file && typeof item.file !== 'string'));
        if (newKnowledge.link) {
            uploadFiles = uploadFiles.filter(item => item.key.includes('media'));
        }
        if (uploadFiles.length > 0) {
            uploadFiles.forEach(uploadFile => {
                formData.append('file', uploadFile.file as File);
                formData.append('key', uploadFile.key);
                formData.append('type', uploadFile.type as string);
            })

            uploadFile(formData, {
                onSuccess: (res) => {
                    let clone = newKnowledge;
                    const files = res.data;
                    for (let file of files) {
                        const [parent, child] = file.key.split('.');
                        clone = {
                            ...clone,
                            [parent]: {
                                ...clone[parent as keyof typeof clone] as any,
                                [child]: file.url
                            }
                        }
                    }
                    handleSubmitKnowledge(clone);
                },
            })
        } else {
            handleSubmitKnowledge(newKnowledge);
        }
    }

    const handleSubmit = () => {
        handleUploadFiles();
    }

    const handleClickEdit = (item: IKnowledge) => {
        setOpenModal(true);
        setNewKnowledge(item);
        setModalTitle(`Cập nhật`);
    }

    const handleChangeCheck = (checked: boolean, key: string) => {
        setNewKnowledge({
            ...newKnowledge,
            [key]: {
                ...newKnowledge[key as keyof typeof newKnowledge] as any,
                downloadable: checked
            }
        })
    }

    const handleChangeFile = (file: File, key: string) => {
        setNewKnowledge({
            ...newKnowledge,
            [key]: {
                ...newKnowledge[key as keyof typeof newKnowledge] as any,
                url: file
            }
        })
    }

    const handleSelectRelatedPosts = (checked: boolean, itemId: string) => {
        setNewKnowledge((prev: any) => ({
            ...prev,
            related_posts: !checked ?
                prev.related_posts.filter((i: string) => i !== itemId) :
                [...prev.related_posts, itemId]
        }))
    }

    function handleChangeOrder(knowledgeId: string, categoryIds: string[], oldOrder: number, newOrder: number) {
        if (oldOrder === newOrder) {
            return;
        }
        changeOrder({knowledgeId, categoryIds, oldOrder, newOrder, categories: subCategories?.pages}, {
            onSuccess: () => {
                toast.success('Cập nhật thành công');
            }
        })
    }

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">{subCategories?.pages?.name}</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                {openModal ? <div className={'flex gap-4'}>
                        <Button
                            onClick={() => {
                                setNewKnowledge(defaultItem);
                                setOpenModal(false);
                            }} size={'lg'}
                            disabled={loadingUpload || loadingUpdate}
                        >
                            Quay lại
                        </Button>
                        <Button
                            onClick={handleSubmit} size={'lg'}
                            disabled={
                                !newKnowledge.name || !newKnowledge.media?.url
                                || loadingUpload || loadingUpdate
                            }
                        >
                            {(loadingUpload || loadingUpdate) &&
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Cập nhật
                        </Button>
                    </div>
                    : ''
                }
            </div>
        </div>
        {(loading || loadingOrder) ? <Loader2 className={'animate-spin'}/> :
            !openModal ? <DataTable
                data={data?.knowledge || []}
                handleClickEdit={handleClickEdit}
                handleChangeOrder={handleChangeOrder}
                // handleClickDelete={handleChangeNewsVisibility}
            /> : <KnowledgeForm
                handleChangeFile={handleChangeFile}
                data={newKnowledge}
                imageUrl={mediaUrl}
                handleChangeData={handleChangeData}
                handleImageChange={handleChangeImage}
                handleChangeCheck={handleChangeCheck}
                handleSelectRelatedPosts={handleSelectRelatedPosts}
            />
        }
    </>
}
