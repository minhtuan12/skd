'use client'

import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Loader2} from "lucide-react";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {toast} from "sonner";
import {IPolicyDocument} from "@/models/policy-document";
import {useFetchPolicyDocument} from "@/app/admin/config/(hooks)/use-policy-document";
import {useAddDocument} from "@/app/admin/config/(hooks)/use-add-document";
import {useUpdateDocument} from "@/app/admin/config/(hooks)/use-update-document";
import DocumentForm from "@/app/admin/config/policy/document/form";
import DataTable from "@/app/admin/config/policy/document/data-table";
import {Button} from "@/components/ui/button";
import {setBreadcrumb} from "@/redux/slices/admin";
import {routes} from "@/constants/routes";
import {useUpdateDocumentOrder} from "@/app/admin/config/(hooks)/use-update-document-order";

const defaultItem: IPolicyDocument = {
    title: '',
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
    image_url: '',
    related_posts: []
}

export default function () {
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);

    const {error, refetch, loading, data} = useFetchPolicyDocument(page);
    const {
        mutate,
        loading: loadingAdd,
        isSuccess,
        isError,
        error: errorUpdate
    } = useAddDocument();
    const {mutate: updateDocument, loading: loadingUpdate} = useUpdateDocument();
    const {mutate: updateDocumentOrder, loading: loadingUpdateOrder} = useUpdateDocumentOrder();
    const {uploadFile, loading: loadingUpload} = useUploadFile();

    const [newDocument, setNewDocument] = useState<IPolicyDocument>(defaultItem);
    const [imageUrl, setImageUrl] = useState('');
    const [modalTitle, setModalTitle] = useState(`Thêm mới`)

    const handleChangeImage = (e: any, key: string, index = -1) => {
        if (typeof e !== 'string') {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onloadend = () => {
                    setNewDocument((prev: any) => ({
                        ...prev,
                        image_url: file
                    }))
                    setImageUrl(reader.result as string);
                }
                reader.readAsDataURL(file)
            }
        } else {
            setNewDocument((prev: any) => ({
                ...prev,
                image_url: e
            }))
            setImageUrl(e as string);
        }
    }

    const handleChangeData = (value: any, key: string) => {
        setNewDocument((prev: any) => ({
            ...prev,
            [key]: value
        }))
    }

    const handleChangeCheck = (checked: boolean, key: string) => {
        setNewDocument({
            ...newDocument,
            [key]: {
                ...newDocument[key as keyof typeof newDocument] as any,
                downloadable: checked
            }
        })
    }

    const handleChangeFile = (file: File, key: string) => {
        setNewDocument({
            ...newDocument,
            [key]: {
                ...newDocument[key as keyof typeof newDocument] as any,
                url: file
            }
        })
    }

    const handleSelectRelatedPosts = (checked: boolean, itemId: string) => {
        setNewDocument((prev: any) => ({
            ...prev,
            related_posts: !checked ?
                prev.related_posts.filter((i: string) => i !== itemId) :
                [...prev.related_posts, itemId]
        }))
    }

    // call api add document
    const handleSubmitDocument = (newDocument: any) => {
        const updatedDocument = {
            ...newDocument,
            title: newDocument.title,
        }
        if (modalTitle.includes('Thêm')) {
            mutate(updatedDocument, {
                onSuccess: () => {
                    toast.success('Thêm mới thành công');
                    setOpenModal(false);
                },
            });
        } else if (modalTitle.includes('Cập nhật')) {
            updateDocument(updatedDocument, {
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
                file: newDocument.image_url,
                key: `image_url`,
                type: 'image',
            },
            {
                file: newDocument.slide.url,
                key: "slide.url",
                type: 'raw',
            },
            {
                file: newDocument.pdf.url,
                key: "pdf.url",
                type: 'pdf',
            },
        ]
        uploadFiles = uploadFiles.filter(item => (item.file && typeof item.file !== 'string'));
        if (newDocument.link) {
            uploadFiles = uploadFiles.filter(item => item.type === 'image');
        }
        if (uploadFiles.length > 0) {
            uploadFiles.forEach(uploadFile => {
                formData.append('file', uploadFile.file as File);
                formData.append('key', uploadFile.key);
                formData.append('type', uploadFile.type as string);
            })

            uploadFile(formData, {
                onSuccess: (res) => {
                    let clone = newDocument;
                    const files = res.data;
                    for (let file of files) {
                        if (file.key.includes('.')) {
                            const [parent, child] = file.key.split('.');
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
                                image_url: file.url
                            }
                        }
                    }
                    handleSubmitDocument(clone);
                },
            })
        } else {
            handleSubmitDocument(newDocument);
        }
    }

    const handleAddDocument = () => {
        setModalTitle(`Thêm mới`)
        setNewDocument(defaultItem)
        setImageUrl('')
        setOpenModal(true);
    }

    const handleSubmit = () => {
        handleUploadFiles();
    }

    const handleClickEdit = (item: IPolicyDocument) => {
        setOpenModal(true);
        setNewDocument(item);
        setModalTitle(`Cập nhật`);
    }

    const handleChangeOrder = (id: string, oldOrder: number, newOrder: number) => {
        if (oldOrder === newOrder) {
            return;
        }
        updateDocumentOrder({docId: id, oldOrder, newOrder}, {
            onSuccess: () => {
                toast.success('Cập nhật thành công');
            }
        });
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: routes.HomeConfig},
            {title: 'Thông tin chính sách'},
            {title: 'Các văn bản chính sách liên quan'},
        ]))
    }, [])

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Các văn bản chính sách liên quan</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                {openModal ? <div className={'flex gap-4'}>
                        <Button
                            onClick={() => {
                                setNewDocument(defaultItem);
                                setOpenModal(false);
                            }} size={'lg'}
                            disabled={loadingAdd || loadingUpload || loadingUpdate}
                        >
                            Quay lại
                        </Button>
                        <Button
                            onClick={handleSubmit} size={'lg'}
                            disabled={
                                !newDocument.title || !newDocument.image_url
                                || loadingAdd || loadingUpload || loadingUpdate
                            }
                        >
                            {(loadingAdd || loadingUpload || loadingUpdate) &&
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {modalTitle.includes('Thêm mới') ? 'Lưu' : 'Cập nhật'}
                        </Button>
                    </div>
                    :
                    <Button onClick={handleAddDocument} size={'lg'}>
                        Thêm mới
                    </Button>
                }
            </div>
        </div>
        {(loading || loadingUpdateOrder) ? <Loader2 className={'animate-spin'}/> :
            !openModal ? <DataTable
                data={data.documents}
                handleClickEdit={handleClickEdit}
                handleChangeOrder={handleChangeOrder}
                // handleClickDelete={handleChangeNewsVisibility}
                setPage={setPage}
                totalPages={data.totalPages}
                page={page}
                total={data.total}
            /> : <DocumentForm
                otherPosts={data.documents}
                handleChangeFile={handleChangeFile}
                handleChangeCheck={handleChangeCheck}
                data={newDocument}
                handleChangeData={handleChangeData}
                imageUrl={imageUrl}
                handleImageChange={handleChangeImage}
                handleSelectRelatedPosts={handleSelectRelatedPosts}
            />
        }
    </>
}
