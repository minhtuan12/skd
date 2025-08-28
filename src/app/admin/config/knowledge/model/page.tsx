'use client'

import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {setBreadcrumb} from "@/redux/slices/admin";
import {Loader2} from "lucide-react";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {Button} from "@/components/ui/button";
import {IKnowledge, KnowledgeTypes} from "@/models/knowledge";
import {useFetchKnowledge} from "@/app/admin/config/(hooks)/use-knowledge";
import {useAddKnowledge} from "@/app/admin/config/(hooks)/use-add-knowledge";
import DataTable from "@/app/admin/config/knowledge/data-table";
import KnowledgeForm from "@/app/admin/config/knowledge/form";
import {toast} from "sonner";
import {useUpdateKnowledge} from "@/app/admin/config/(hooks)/use-update-knowledge";

const defaultItem: IKnowledge = {
    description: '',
    name: '',
    tree_type: null,
    category: KnowledgeTypes.model,
    media: {
        url: '',
        media_type: 'image'
    }
}

export default function Model() {
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();

    const {error, refetch, loading, data} = useFetchKnowledge(KnowledgeTypes.model);
    const {
        mutate,
        loading: loadingAdd,
        isSuccess,
        isError,
        error: errorUpdate
    } = useAddKnowledge(KnowledgeTypes.model);
    const {mutate: updateKnowledge, loading: loadingUpdate} = useUpdateKnowledge(KnowledgeTypes.model);
    const {uploadFile, loading: loadingUpload} = useUploadFile();

    const [newKnowledge, setNewKnowledge] = useState<IKnowledge>(defaultItem);
    const [mediaUrl, setMediaUrl] = useState('');
    const [modalTitle, setModalTitle] = useState(`Thêm mới`)

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Ngân hàng kiến thức', href: ''},
            {title: 'Mô hình điển hình'}
        ]))
    }, [])

    const handleChangeData = (value: any, key: string) => {
        setNewKnowledge((prev: any) => ({
            ...prev,
            [key]: value
        }))
    }

    // call api add knowledge
    const handleSubmitKnowledge = (newKnowledge: any) => {
        if (modalTitle.includes('Thêm')) {
            mutate(newKnowledge, {
                onSuccess: () => {
                    toast.success('Thêm mới thành công');
                    setOpenModal(false);
                },
            });
        } else if (modalTitle.includes('Cập nhật')) {
            updateKnowledge(newKnowledge, {
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
        let uploadedFile = {
            file: newKnowledge.media?.url,
            key: `knowledge.0`,
            type: newKnowledge.media?.media_type,
        }

        if (typeof newKnowledge.media?.url !== 'string') {
            formData.append('file', uploadedFile.file as File);
            formData.append('key', uploadedFile.key);
            formData.append('type', uploadedFile.type as string);

            uploadFile(formData, {
                onSuccess: (res) => {
                    let clone = newKnowledge;
                    clone = {
                        ...clone,
                        media: {
                            url: res.data[0].url,
                            media_type: newKnowledge.media?.media_type as ('video' | 'image')
                        }
                    }
                    handleSubmitKnowledge(clone);
                },
            })
        } else {
            handleSubmitKnowledge(newKnowledge);
        }
    }

    const handleAddKnowledge = () => {
        setModalTitle(`Thêm mới`)
        setNewKnowledge(defaultItem)
        setMediaUrl('')
        setOpenModal(true);
    }

    const handleSubmit = () => {
        handleUploadFiles();
    }

    const handleClickEdit = (item: IKnowledge) => {
        setOpenModal(true);
        setNewKnowledge(item);
        setModalTitle(`Cập nhật`);
    }

    const handleDropMedia = (files: File[]) => {
        setNewKnowledge({
            ...newKnowledge,
            media: {
                url: files[0],
                media_type: files[0].type.includes('video') ? 'video' : 'image',
            }
        })
    }

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Mô hình điển hình</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                {openModal ? <div className={'flex gap-4'}>
                        <Button
                            onClick={() => {
                                setNewKnowledge(defaultItem);
                                setOpenModal(false);
                            }} size={'lg'}
                            disabled={loadingAdd || loadingUpload || loadingUpdate}
                        >
                            Quay lại
                        </Button>
                        <Button
                            onClick={handleSubmit} size={'lg'}
                            disabled={
                                !newKnowledge.description
                                || loadingAdd || loadingUpload || loadingUpdate
                            }
                        >
                            {(loadingAdd || loadingUpload || loadingUpdate) &&
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {modalTitle.includes('Thêm mới') ? 'Lưu' : 'Cập nhật'}
                        </Button>
                    </div>
                    :
                    <Button onClick={handleAddKnowledge} size={'lg'}>
                        Thêm mới
                    </Button>
                }
            </div>
        </div>
        {loading ? <Loader2 className={'animate-spin'}/> :
            !openModal ? <DataTable
                category={KnowledgeTypes.model}
                data={data.knowledge}
                handleClickEdit={handleClickEdit}
                // handleClickDelete={handleChangeNewsVisibility}
            /> : <KnowledgeForm
                data={newKnowledge}
                handleChangeData={handleChangeData}
                imageUrl={mediaUrl}
                handleDrop={handleDropMedia}
            />
        }
    </>
}
