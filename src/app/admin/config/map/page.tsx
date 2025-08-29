'use client'

import React, {useEffect, useState} from "react";
import {setBreadcrumb} from "@/redux/slices/admin";
import {useDispatch} from "react-redux";
import {Loader2, Pencil} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {formatDate} from "@/lib/utils";
import {useFetchMaps} from "@/app/admin/config/(hooks)/use-map";
import {useAddMap} from "@/app/admin/config/(hooks)/use-add-map";
import {useUpdateMap} from "@/app/admin/config/(hooks)/use-update-map";
import {IMap} from "@/models/map";
import Image from "next/image";
import MapForm from "@/app/admin/config/map/form";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";

export default function Map() {
    const dispatch = useDispatch();
    const {data, loading: loadingFetch} = useFetchMaps();
    const {mutate: addMap, loading, isSuccess} = useAddMap();
    const {mutate: updateMap, loading: loadingUpdate, isSuccess: isSuccessUpdate} = useUpdateMap();

    const [map, setMap] = useState<IMap>({name: '', image_url: ''});
    const [modalTitle, setModalTitle] = useState<string>('Thêm bản đồ mới');
    const [openModal, setOpenModal] = useState(false);
    const [oldImageUrl, setOldImageUrl] = useState('');
    const {uploadFile, loading: loadingUpload} = useUploadFile();

    function handleOpenCreateModal() {
        setModalTitle('Thêm bản đồ mới');
        setMap({name: '', image_url: ''});
        setOpenModal(true);
    }

    function handleSubmit(newMap: any) {
        if (modalTitle.includes('Thêm')) {
            addMap({name: newMap.name, image_url: newMap.image_url}, {
                onSuccess: () => {
                    setMap({name: '', image_url: ''});
                    setOpenModal(false);
                }
            });
        } else if (newMap._id) {
            updateMap(newMap, {
                onSuccess: () => {
                    setOldImageUrl('');
                    setMap({name: '', image_url: ''});
                    setOpenModal(false);
                }
            });
        }
    }

    const handleUploadFiles = () => {
        const formData = new FormData();
        let uploadedFile = {
            file: map.image_url,
            key: `map.0`,
            type: 'image',
            oldUrl: oldImageUrl,
        }

        if (typeof map.image_url !== 'string') {
            formData.append('file', uploadedFile.file as File);
            formData.append('key', uploadedFile.key);
            formData.append('type', uploadedFile.type as string);
            formData.append('oldUrl', uploadedFile.oldUrl);

            uploadFile(formData, {
                onSuccess: (res) => {
                    let clone = map;
                    clone = {
                        ...clone,
                        image_url: res.data[0].url
                    }
                    handleSubmit(clone);
                },
            })
        } else {
            handleSubmit(map);
        }
    }

    function handleChangeInput(value: string) {
        setMap({...map, name: value});
    }

    const handleDrop = (files: File[]) => {
        setMap({
            ...map,
            image_url: files[0],
        })
    }

    function handleClickUpdate(item: IMap) {
        setOldImageUrl(item.image_url as string);
        setMap(item);
        setModalTitle(`Cập nhật ${item.name}`);
        setOpenModal(true);
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Quản lý bản đồ'}
        ]))
    }, [])

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">
                Quản lý bản đồ {openModal ? ` - ${modalTitle}` : ''}
            </h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                {openModal ? <div className={'flex gap-4'}>
                        <Button
                            onClick={() => {
                                setMap({name: '', image_url: ''});
                                setOpenModal(false);
                                setOldImageUrl('');
                            }} size={'lg'}
                            disabled={loading || loadingUpload || loadingUpdate}
                        >
                            Quay lại
                        </Button>
                        <Button
                            onClick={handleUploadFiles} size={'lg'}
                            disabled={
                                !map.name || !map.image_url
                                || loading || loadingUpload || loadingUpdate
                            }
                        >
                            {(loading || loadingUpload || loadingUpdate) &&
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {modalTitle.includes('Thêm') ? 'Lưu' : 'Cập nhật'}
                        </Button>
                    </div>
                    :
                    <Button onClick={handleOpenCreateModal} size={'lg'}>
                        Thêm mới
                    </Button>
                }
            </div>
        </div>
        {
            loadingFetch ? <Loader2 className={'animate-spin w-8 h-8'}/> :
                <>
                    {
                        !openModal ? <Table className={'text-base'}>
                            <TableHeader className={'bg-[#f5f5f590]'}>
                                <TableRow>
                                    <TableHead className={'text-center w-20'}>STT</TableHead>
                                    <TableHead className={'text-center w-60'}>Bản đồ</TableHead>
                                    <TableHead className={'pl-5'}>Tên bản đồ</TableHead>
                                    <TableHead className={'text-center'}>Ngày tạo</TableHead>
                                    <TableHead className={'text-center w-100'}>Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(data?.maps || []).map((item: IMap, i: number) => (
                                    <TableRow key={item._id}>
                                        <TableCell className={'text-center'}>{i + 1}</TableCell>
                                        <TableCell className="font-medium">
                                            <Image
                                                src={item.image_url as string}
                                                alt={item.name} width={0} height={0}
                                                sizes={'100vw'}
                                                style={{width: "100%", height: "100%"}}
                                                className={'object-cover'}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium pl-5">{item.name}</TableCell>
                                        <TableCell className={'text-center'}>{formatDate(item.createdAt as string)}</TableCell>
                                        <TableCell className={'text-center'}>
                                            <Button onClick={() => handleClickUpdate(item)}><Pencil/>Sửa</Button>
                                            {/*<Button*/}
                                            {/*    className={'bg-red-500 text-white hover:bg-red-600'}><Trash/>Xóa</Button>*/}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table> : <MapForm data={map} handleChangeData={handleChangeInput} handleDrop={handleDrop}/>
                    }
                </>
        }
    </>
}
