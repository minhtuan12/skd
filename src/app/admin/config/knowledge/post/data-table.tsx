'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React, {useCallback} from "react";
import Image from "next/image";
import {IKnowledge} from "@/models/knowledge";
import {Button} from "@/components/ui/button";
import {Loader2, Trash} from "lucide-react";
import {VideoPlayer} from "@/components/ui/video";
import {IKnowledgeCategory} from "@/models/knowledge-category";
import {Checkbox} from "@/components/ui/checkbox";
import {Badge} from "@/components/ui/badge";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useFetchSubCategory} from "@/app/admin/config/(hooks)/use-sub-category";
import {toast} from "sonner";

export default function DataTable(
    {data, handleClickEdit, handleClickDelete, categories, addCategoryToKnowledge, loadingSubmit}:
    {
        data: IKnowledge[],
        handleClickEdit: any,
        handleClickDelete?: any,
        categories: IKnowledgeCategory[],
        addCategoryToKnowledge: any,
        loadingSubmit: boolean
    }
) {
    const categoryIds = categories?.length > 0 ? new Set(categories?.map(i => i._id)) : new Set();
    const [openDialog, setOpenDialog] = React.useState<IKnowledge | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');
    const {data: subCategories, loading} = useFetchSubCategory(selectedCategoryId);

    const handleCheckCategory = useCallback((checked: any, knowledge: IKnowledge, category: IKnowledgeCategory) => {
        if (category.children && category.children.length > 0) {
            setSelectedCategoryId(category._id as string);
            setOpenDialog(knowledge);
        } else {
            addCategoryToKnowledge({
                knowledgeId: knowledge._id,
                categories: checked ? [...knowledge.category, category._id] :
                    knowledge.category.filter(i => (i as string) !== category._id),
            }, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                }
            })
        }
    }, [addCategoryToKnowledge]);

    function handleSubmitAddSubCategory() {
        if (openDialog) {
            addCategoryToKnowledge({
                knowledgeId: openDialog._id as string,
                categories: openDialog.category
            }, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                    setSelectedCategoryId('');
                    setOpenDialog(null);
                }
            })
        }
    }

    function handleSelectSubCategory(checked: any, subCategory: IKnowledgeCategory) {
        if (subCategory) {
            setOpenDialog(prev => ({
                ...prev,
                category: checked ? [
                        ...(prev as IKnowledge).category,
                        subCategory._id
                    ] as string[] :
                    (prev as IKnowledge).category.filter(i => i !== subCategory._id)
            } as IKnowledge))
        }
    }

    return <>
        <Table className={'text-base'}>
            <TableHeader className={'bg-[#f5f5f590]'}>
                <TableRow className={'h-auto'}>
                    <TableHead className={'text-center w-20'}>Hình ảnh</TableHead>
                    <TableHead className={'pl-3 w-50'}>Tên</TableHead>
                    {
                        categories?.length > 0 ? categories.map((item: IKnowledgeCategory) => (
                            <TableHead className={'text-center w-30 h-auto break-words whitespace-normal'}
                                       key={item?._id}>
                                {item.name}
                            </TableHead>
                        )) : ''
                    }
                    <TableHead className={'text-center w-20'}>Hành động</TableHead>
                </TableRow>
            </TableHeader>
        </Table>
        <div className={'min-h-[calc(100vh-205px)] max-h-[calc(100vh-205px)] overflow-y-auto border-b border-gray-200'}>
            <Table className={'text-base'}>
                <TableBody>
                    {data.map((item: IKnowledge, index: number) => {
                        const notParentCates = item.category.filter(it => !categoryIds?.has(it as string));
                        const itemCategory = new Set(item.category as string[]);

                        return <TableRow key={item._id}>
                            <TableCell className={'h-20 w-20'}>
                                {item.media?.media_type === 'image' ? <Image
                                    src={item?.media?.url as string}
                                    alt={item.name} width={0} height={0}
                                    sizes={'100vw'}
                                    style={{width: "100%", height: "100%"}}
                                    className={'object-cover'}
                                /> : <VideoPlayer src={item?.media?.url as string}/>
                                }
                            </TableCell>
                            <TableCell className={'font-medium whitespace-normal pl-4 w-50'}>{item.name}</TableCell>
                            {
                                categories?.length > 0 ? categories.map((i: IKnowledgeCategory) => {
                                    const childIds = new Set(i.children?.map(c => (c as IKnowledgeCategory)._id) || []);
                                    const hasChild = i.children && i.children?.length > 0;
                                    const childrenContainsNotParentCates = notParentCates.filter(it => childIds.has(it as string));
                                    const isChecked = !hasChild ? itemCategory.has(i._id as string)
                                        : childrenContainsNotParentCates.length > 0;

                                    return <TableCell
                                        className={'font-medium pl-4 w-30 space-x-1 text-center [&>[role=checkbox]]:!size-5.5'}
                                        key={i._id}
                                    >
                                        <Checkbox
                                            className={'border-gray-400'}
                                            value={i._id}
                                            checked={isChecked}
                                            onCheckedChange={(checked) => handleCheckCategory(checked, item, i)}
                                        />
                                        {
                                            hasChild ?
                                                <Badge variant="secondary"
                                                       className={'text-[15px]'}>+{childrenContainsNotParentCates.length}</Badge>
                                                : ''
                                        }
                                    </TableCell>
                                }) : ''
                            }
                            <TableCell className={'text-center w-20'}>
                                {/*<Button className={'bg-red-500'}*/}
                                {/*        onClick={() => handleClickEdit(item)}><Trash/>Xóa</Button>*/}
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </div>
        <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Chọn vấn đề
                    </DialogTitle>
                </DialogHeader>

                {loading ? <Loader2 className={'animate-spin w-6 h-6'}/> : (openDialog ? (
                    <div className="flex flex-col gap-2">
                        <div className={'font-semibold'}>{openDialog?.name}</div>
                        {subCategories.pages?.children.map((child: IKnowledgeCategory) => (
                            <label key={child._id} className="flex items-center gap-2">
                                <Checkbox
                                    value={child._id}
                                    checked={(openDialog?.category as string[])?.includes(child._id as string)}
                                    onCheckedChange={(checked) => handleSelectSubCategory(checked, child)}
                                />
                                {child.name}
                            </label>
                        ))}
                    </div>
                ) : '')}

                <Button onClick={handleSubmitAddSubCategory} disabled={loadingSubmit}>
                    {loadingSubmit ? <Loader2 className={'w-4 h-4 animate-spin'}/> : ''}
                    Lưu
                </Button>
            </DialogContent>
        </Dialog>
    </>
}
