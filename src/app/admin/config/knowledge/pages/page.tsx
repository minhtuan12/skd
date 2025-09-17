'use client'

import React, {useEffect, useState} from "react";
import {setBreadcrumb} from "@/redux/slices/admin";
import {useDispatch} from "react-redux";
import {Loader2, Pencil, Trash} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {formatDate} from "@/lib/utils";
import {useAddCategory} from "@/app/admin/config/(hooks)/use-add-knowledge-category";
import {useUpdateCategory} from "@/app/admin/config/(hooks)/use-update-knowledge-category";
import {IKnowledgeCategory} from "@/models/knowledge-category";
import CategoryForm from "@/app/admin/config/knowledge/pages/category-form";
import {Checkbox} from "@/components/ui/checkbox";
import {useChangeCategoryVisibility} from "@/app/admin/config/(hooks)/use-hide-knowledge-category";
import {useFetchKnowledgeCategoryAdmin} from "@/app/admin/config/(hooks)/use-knowledge-category-admin";
import {closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableRow from "@/components/custom/sortable-table-row";
import {useUpdateCategoryPos} from "@/app/admin/config/(hooks)/use-update-category-position";
import {useDeleteCategory} from "@/app/admin/config/(hooks)/use-delete-knowledge-category";
import {toast} from "sonner";

export default function Category() {
    const dispatch = useDispatch();
    const {data, loading: loadingFetch} = useFetchKnowledgeCategoryAdmin();
    const {mutate: addCategory, loading, isSuccess} = useAddCategory();
    const {mutate: updateCategory, loading: loadingUpdate, isSuccess: isSuccessUpdate} = useUpdateCategory();
    const {mutate: deleteCategory, loading: loadingDelete} = useDeleteCategory();
    const {mutate: changeVisibility, loading: loadingHide} = useChangeCategoryVisibility();
    const {mutate: updatePos, loading: loadingPos} = useUpdateCategoryPos();

    const [category, setCategory] = useState<IKnowledgeCategory>({name: '', children: []});
    const [modalTitle, setModalTitle] = useState<string>('Thêm trang mới');
    const [openModal, setOpenModal] = useState(false);
    const sensors = useSensors(useSensor(PointerSensor));
    const [activeId, setActiveId] = useState<string | null>(null);
    const [deletedId, setDeletedId] = useState<string | null>(null);

    function handleDragStart(event: any) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event: any) {
        const {active, over} = event;
        const indexes = data?.knowledge_categories.map((i: any) => i._id) || [];
        if (active.id !== over.id) {
            updatePos(arrayMove(indexes, indexes.indexOf(active.id), indexes.indexOf(over.id)));
        }
        setActiveId(null);
    }

    function handleOpenCreateModal() {
        setModalTitle('Thêm trang mới');
        setCategory({name: '', children: []});
        setOpenModal(true);
    }

    function handleSubmit() {
        if (modalTitle.includes('Thêm')) {
            addCategory({name: category.name, children: category.children}, {
                onSuccess: () => {
                    setCategory({name: '', children: []});
                    setOpenModal(false);
                }
            });
        } else if (category._id) {
            updateCategory(category, {
                onSuccess: () => {
                    setCategory({name: '', children: []});
                    setOpenModal(false);
                }
            });
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

    function handleDelete(id: string) {
        setDeletedId(id);
        deleteCategory(id, {
            onSuccess: () => {
                toast.success('Xóa thành công');
            },
            onSettled: () => {
                setDeletedId(null);
            }
        })
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
            (loadingFetch || loadingHide || loadingPos) ? <Loader2 className={'animate-spin w-8 h-8'}/> :
                <>
                    {
                        (!openModal && data?.knowledge_categories) ?
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <Table className={'text-base'}>
                                    <TableHeader className={'bg-[#f5f5f590]'}>
                                        <TableRow>
                                            <TableHead className={'text-center w-10'}></TableHead>
                                            <TableHead className={'text-center'}>STT</TableHead>
                                            <TableHead>Tên trang</TableHead>
                                            <TableHead>Ngày tạo</TableHead>
                                            <TableHead className={'text-center'}>Hiển thị</TableHead>
                                            <TableHead className={'text-center w-100'}>Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <SortableContext
                                            items={data?.knowledge_categories}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {data?.knowledge_categories.map((type: IKnowledgeCategory, index: number) => (
                                                <SortableRow id={type._id as string} key={type._id}>
                                                    <TableCell
                                                        className="font-medium text-center">{index + 1}</TableCell>
                                                    <TableCell className="font-medium">{type.name}</TableCell>
                                                    <TableCell>{formatDate(type.createdAt as string)}</TableCell>
                                                    <TableCell className={'text-center'}>
                                                        <Checkbox
                                                            value={type._id}
                                                            checked={!type.is_deleted}
                                                            onCheckedChange={(e) => {
                                                                changeVisibility(type._id);
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        className={'flex items-center justify-center text-center gap-4'}>
                                                        <Button
                                                            onClick={() => handleClickUpdate(type)}><Pencil/>Sửa</Button>
                                                        <Button
                                                            onClick={() => handleDelete(type._id as string)}
                                                            className={'bg-red-500 text-white hover:bg-red-600'}
                                                            disabled={loadingDelete && deletedId === type._id as string}
                                                        >
                                                            {(loadingDelete && deletedId === type._id as string) ?
                                                                <Loader2 className={'w-4 h-4 animate-spin'}/> : ''}
                                                            <Trash/>Xóa
                                                        </Button>
                                                    </TableCell>
                                                </SortableRow>
                                            ))}
                                        </SortableContext>
                                        <DragOverlay>
                                            {activeId ? (
                                                <TableRow className="bg-white shadow-lg">
                                                    <TableCell colSpan={5}>
                                                        {data?.knowledge_categories.find((c: any) => c._id === activeId)?.name}
                                                    </TableCell>
                                                </TableRow>
                                            ) : null}
                                        </DragOverlay>
                                    </TableBody>
                                </Table>
                            </DndContext> : <CategoryForm data={category} handleChangeData={handleChangeInput}/>
                    }
                </>
        }
    </>
}
