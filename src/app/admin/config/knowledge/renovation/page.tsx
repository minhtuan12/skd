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
    category: KnowledgeTypes.renovation,
    media: {
        url: '',
        media_type: 'image'
    }
}

export default function Renovation() {
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();

    const {error, refetch, loading, data} = useFetchKnowledge(KnowledgeTypes.renovation);
    const {
        mutate,
        loading: loadingAdd,
        isSuccess,
        isError,
        error: errorUpdate
    } = useAddKnowledge(KnowledgeTypes.renovation);
    const {mutate: updateKnowledge, loading: loadingUpdate} = useUpdateKnowledge(KnowledgeTypes.renovation);
    const {uploadFile, loading: loadingUpload} = useUploadFile();

    const [newKnowledge, setNewKnowledge] = useState<IKnowledge>(defaultItem);
    const [mediaUrl, setMediaUrl] = useState('');
    const [modalTitle, setModalTitle] = useState(`Thêm mới`)

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Ngân hàng kiến thức', href: ''},
            {title: 'Kỹ thuật cải tạo đất'}
        ]))
    }, [])

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>, key: string, index = -1) => {
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

        }
        if (modalTitle.includes('Thêm')) {
            mutate(updatedKnowledge, {
                onSuccess: () => {
                    toast.success('Thêm mới thành công');
                    setOpenModal(false);
                },
            });
        } else if (modalTitle.includes('Cập nhật')) {
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

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Kỹ thuật cải tạo đất</h2>
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
                                !newKnowledge.name || !newKnowledge.description || !newKnowledge.media?.url
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
                category={KnowledgeTypes.renovation}
                data={data.knowledge}
                handleClickEdit={handleClickEdit}
                // handleClickDelete={handleChangeNewsVisibility}
            /> : <KnowledgeForm
                data={newKnowledge}
                handleChangeData={handleChangeData}
                imageUrl={mediaUrl}
                handleImageChange={handleChangeImage}
            />
        }
    </>
}
