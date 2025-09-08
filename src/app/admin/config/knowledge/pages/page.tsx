'use client'

import React, {useEffect, useState} from "react";
import {setBreadcrumb} from "@/redux/slices/admin";
import {useDispatch} from "react-redux";
import {Loader2, Pencil} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {formatDate} from "@/lib/utils";
import {useFetchKnowledgeCategory} from "@/app/admin/config/(hooks)/use-knowledge-category";
import {useAddCategory} from "@/app/admin/config/(hooks)/use-add-knowledge-category";
import {useUpdateCategory} from "@/app/admin/config/(hooks)/use-update-knowledge-category";
import {IKnowledgeCategory} from "@/models/knowledge-category";
import CategoryForm from "@/app/admin/config/knowledge/pages/category-form";

export default function Category() {
    const dispatch = useDispatch();
    const {data, loading: loadingFetch} = useFetchKnowledgeCategory();
    const {mutate: addCategory, loading, isSuccess} = useAddCategory();
    const {mutate: updateCategory, loading: loadingUpdate, isSuccess: isSuccessUpdate} = useUpdateCategory();

    const [category, setCategory] = useState<IKnowledgeCategory>({name: '', children: []});
    const [modalTitle, setModalTitle] = useState<string>('Thêm trang mới');
    const [openModal, setOpenModal] = useState(false);

    function handleOpenCreateModal() {
        setModalTitle('Thêm trang mới');
        setCategory({name: '', children: []});
        setOpenModal(true);
    }

    function handleSubmit() {
        if (modalTitle.includes('Thêm')) {
            addCategory({name: category.name, children: category.children});
            if (isSuccess) {
                setCategory({name: '', children: []});
                setOpenModal(false);
            }
        } else if (category._id) {
            updateCategory(category);
            if (isSuccessUpdate) {
                setCategory({name: '', children: []});
                setOpenModal(false);
            }
        }
    }

    function handleChangeInput(value: string | string[], key: string) {
        setCategory({...category, [key]: value});
    }

    function handleClickUpdate(item: IKnowledgeCategory) {
        setCategory(item);
        setModalTitle(`Cập nhật ${item.name}`);
        setOpenModal(true);
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Ngân hàng kiến thức', href: ''},
            {title: 'Quản lý trang'}
        ]))
    }, [])

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Quản lý trang</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                {openModal ? <div className={'flex gap-4'}>
                        <Button
                            onClick={() => {
                                setCategory({name: '', children: []});
                                setOpenModal(false);
                            }} size={'lg'}
                            disabled={loading || loadingUpdate}
                        >
                            Quay lại
                        </Button>
                        <Button
                            onClick={handleSubmit} size={'lg'}
                            disabled={!category.name || loading || loadingUpdate}
                        >
                            {(loading || loadingUpdate) &&
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {modalTitle.includes('Thêm') ? 'Lưu' : 'Cập nhật'}
                        </Button>
                    </div>
                    :
                    <Button onClick={handleOpenCreateModal} size={'lg'}>
                        Thêm trang mới
                    </Button>
                }
            </div>
        </div>
        {
            loadingFetch ? <Loader2 className={'animate-spin w-8 h-8'}/> :
                <>
                    {
                        (!openModal && data?.pages) ? <Table className={'text-base'}>
                            <TableHeader className={'bg-[#f5f5f590]'}>
                                <TableRow>
                                    <TableHead>Tên trang</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead className={'text-center w-100'}>Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.pages.map((type: IKnowledgeCategory) => (
                                    <TableRow key={type._id}>
                                        <TableCell className="font-medium">{type.name}</TableCell>
                                        <TableCell>{formatDate(type.createdAt as string)}</TableCell>
                                        <TableCell className={'flex items-center justify-center text-center gap-4'}>
                                            <Button onClick={() => handleClickUpdate(type)}><Pencil/>Sửa</Button>
                                            {/*<Button*/}
                                            {/*    className={'bg-red-500 text-white hover:bg-red-600'}><Trash/>Xóa</Button>*/}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table> : <CategoryForm data={category} handleChangeData={handleChangeInput}/>
                    }
                </>
        }
    </>
}
