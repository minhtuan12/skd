'use client'

import React, {useContext, useEffect, useState} from "react";
import {setBreadcrumb} from "@/redux/slices/admin";
import {useDispatch} from "react-redux";
import {AdminButtonContext} from "@/contexts/AdminButtonContext";
import {useFetchTreeType} from "@/app/admin/config/(hooks)/use-tree-type";
import {Loader2, Pencil, Trash} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useAddTreeType} from "@/app/admin/config/(hooks)/use-add-tree-type";
import {ITreeType} from "@/models/tree-type";
import {Input} from "@/components/ui/input";
import {formatDate} from "@/lib/utils";
import {useUpdateTreeType} from "@/app/admin/config/(hooks)/use-update-tree-type";

export default function TreeType() {
    const dispatch = useDispatch();
    const {setHandlers} = useContext(AdminButtonContext);
    const [query, setQuery] = useState({
        q: '',
        page: 1
    })
    const {data, loading: loadingFetch} = useFetchTreeType(query.q, query.page);
    const {mutate: addTreeType, loading, isSuccess} = useAddTreeType();
    const {mutate: updateTreeType, loading: loadingUpdate, isSuccess: isSuccessUpdate} = useUpdateTreeType();

    const [treeType, setTreeType] = useState<ITreeType>({name: ''});
    const [modalTitle, setModalTitle] = useState<string>('Thêm nhóm cây mới');
    const [openModal, setOpenModal] = useState(false);

    function handleOpenCreateModal() {
        setModalTitle('Thêm nhóm cây mới');
        setTreeType({name: ''});
        setOpenModal(true);
    }

    function handleSubmit() {
        if (modalTitle.includes('Thêm')) {
            addTreeType({name: treeType.name});
            if (isSuccess) {
                setTreeType({name: ''});
                setOpenModal(false);
            }
        } else if (treeType._id) {
            updateTreeType(treeType);
            if (isSuccessUpdate) {
                setTreeType({name: ''});
                setOpenModal(false);
            }
        }
    }

    function handleChangeInput(value: string) {
        setTreeType({...treeType, name: value});
    }

    function handleClickUpdate(item: ITreeType) {
        setTreeType(item);
        setModalTitle(`Cập nhật ${item.name}`);
        setOpenModal(true);
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Ngân hàng kiến thức', href: ''},
            {title: 'Quản lý nhóm cây'}
        ]))
    }, [])

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Quản lý nhóm cây</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                <Button onClick={handleOpenCreateModal} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Thêm nhóm mới
                </Button>
            </div>
        </div>
        {
            loadingFetch ? <Loader2 className={'animate-spin w-8 h-8'}/> :
                <>
                    {
                        data?.tree_types?.data ? <Table className={'text-base'}>
                            <TableHeader className={'bg-[#f5f5f590]'}>
                                <TableRow>
                                    <TableHead>Tên nhóm</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead className={'text-center w-100'}>Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.tree_types.data.map((type: ITreeType) => (
                                    <TableRow key={type._id}>
                                        <TableCell className="font-medium">{type.name}</TableCell>
                                        <TableCell>{formatDate(type.createdAt as string)}</TableCell>
                                        <TableCell className={'flex items-center justify-center text-center gap-4'}>
                                            <Button onClick={() => handleClickUpdate(type)}><Pencil/>Sửa</Button>
                                            <Button
                                                className={'bg-red-500 text-white hover:bg-red-600'}><Trash/>Xóa</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table> : ''
                    }
                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{modalTitle}</DialogTitle>
                            </DialogHeader>
                            <Input
                                placeholder={modalTitle.includes('Thêm') ? 'Nhập tên nhóm cây' : ''}
                                value={treeType.name || ''}
                                onChange={e => handleChangeInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.code === 'Enter') {
                                        handleSubmit();
                                    }
                                }}
                            />
                            <div className={'w-full flex justify-end'}>
                                <Button className={'w-1/3'}
                                        disabled={!treeType.name || loading || loadingUpdate}
                                        onClick={handleSubmit}
                                >
                                    {(loading || loadingUpdate) ?
                                        <Loader2 className={'animate-spin'}/> : ''} Lưu
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
        }
    </>
}
