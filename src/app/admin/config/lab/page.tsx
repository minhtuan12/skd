'use client'

import React, {useEffect, useState} from "react";
import {setBreadcrumb} from "@/redux/slices/admin";
import {useDispatch} from "react-redux";
import {Loader2, Pencil} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useFetchLabs} from "@/app/admin/config/(hooks)/use-lab";
import {useAddLab} from "@/app/admin/config/(hooks)/use-add-lab";
import {useUpdateLab} from "@/app/admin/config/(hooks)/use-update-lab";
import {ILab} from "@/models/lab";
import LabForm from "@/app/admin/config/lab/form";
import {formatDate} from "@/lib/utils";

const defaultLab = {
    name: '',
    category: '',
    address: '',
    location: {
        type: 'Point',
        coordinates: [0, 0]
    },
    first_license_date: new Date(),
    validity_time: new Date(),
    decision: ''
}

export default function Lab() {
    const dispatch = useDispatch();
    const {data, loading: loadingFetch} = useFetchLabs();
    const {mutate: addLab, loading, isSuccess} = useAddLab();
    const {mutate: updateLab, loading: loadingUpdate, isSuccess: isSuccessUpdate} = useUpdateLab();

    const [lab, setLab] = useState<ILab>(defaultLab);
    const [modalTitle, setModalTitle] = useState<string>('Thêm mới');
    const [openModal, setOpenModal] = useState(false);

    function handleOpenCreateModal() {
        setModalTitle('Thêm mới');
        setLab(defaultLab);
        setOpenModal(true);
    }

    function handleSubmit() {
        if (modalTitle.includes('Thêm')) {
            addLab({
                name: lab.name,
                category: lab.category,
                address: lab.address,
                location: lab.location,
                first_license_date: lab.first_license_date,
                validity_time: lab.validity_time,
                decision: lab.decision,
            }, {
                onSuccess: () => {
                    setLab(defaultLab);
                    setOpenModal(false);
                }
            });
        } else if (lab._id) {
            updateLab(lab, {
                onSuccess: () => {
                    setLab(defaultLab);
                    setOpenModal(false);
                }
            });
        }
    }

    function handleChangeInput(value: string | number, key: string) {
        if (key === 'lng') {
            setLab({
                ...lab,
                location: {...lab.location, coordinates: [(value as number), lab.location.coordinates[1]]}
            })
        } else if (key === 'lat') {
            setLab({
                ...lab,
                location: {...lab.location, coordinates: [lab.location.coordinates[0], (value as number)]}
            })
        } else {
            setLab({...lab, [key]: value});
        }
    }

    function handleClickUpdate(item: ILab) {
        setLab(item);
        setModalTitle(`Cập nhật ${item.name}`);
        setOpenModal(true);
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Quản lý phòng thí nghiệm'}
        ]))
    }, [])

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">
                {!openModal ? 'Quản lý phòng thí nghiệm' : modalTitle}
            </h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                {openModal ? <div className={'flex gap-4'}>
                        <Button
                            onClick={() => {
                                setLab(defaultLab);
                                setOpenModal(false);
                            }} size={'lg'}
                            disabled={loading || loadingUpdate}
                        >
                            Quay lại
                        </Button>
                        <Button
                            onClick={handleSubmit} size={'lg'}
                            disabled={
                                !lab?.name || !lab.category ||
                                !lab.address || !lab.location ||
                                !lab.first_license_date || !lab.validity_time || !lab.decision
                                || loading || loadingUpdate
                            }
                        >
                            {(loading || loadingUpdate) &&
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
                                    <TableHead className={'max-w-60'}>Tên tổ chức</TableHead>
                                    <TableHead className={'text-center w-20'}>Lĩnh vực chỉ định</TableHead>
                                    <TableHead className={'w-40'}>Địa chỉ</TableHead>
                                    <TableHead className={'text-center w-30'}>Thời gian cấp lần đầu</TableHead>
                                    <TableHead className={'text-center w-30'}>Hiệu lực chỉ định</TableHead>
                                    <TableHead className={'w-40'}>Quyết định chỉ định</TableHead>
                                    <TableHead className={'text-center w-20'}>Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(data?.labs || []).map((item: ILab, i: number) => (
                                    <TableRow key={item._id}>
                                        <TableCell className={'text-center'}>{i + 1}</TableCell>
                                        <TableCell
                                            className="font-medium w-60 whitespace-normal break-words">{item.name}</TableCell>
                                        <TableCell className="font-normal w-20 text-center">{item.category}</TableCell>
                                        <TableCell
                                            className="font-normal w-40 whitespace-normal break-words">{item.address}</TableCell>
                                        <TableCell className="font-normal text-center w-30">
                                            {formatDate(item.first_license_date as string)}
                                        </TableCell>
                                        <TableCell className="font-normal text-center w-30">
                                            {formatDate(item.validity_time as string)}
                                        </TableCell>
                                        <TableCell
                                            className="font-normal w-40 whitespace-normal break-words">{item.decision}</TableCell>
                                        <TableCell className={'text-center w-20'}>
                                            <Button onClick={() => handleClickUpdate(item)}><Pencil/>Sửa</Button>
                                            {/*<Button*/}
                                            {/*    className={'bg-red-500 text-white hover:bg-red-600'}><Trash/>Xóa</Button>*/}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table> : <LabForm data={lab} handleChangeData={handleChangeInput}/>
                    }
                </>
        }
    </>
}
