'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React, {useCallback} from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Loader2, Pencil, Trash} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {IPost} from "@/models/post";
import {ISection} from "@/models/section";
import {toast} from "sonner";

export default function DataTable(
    {
        data,
        handleClickDelete,
        sections,
        addPostToSection,
        loadingDelete,
        handleClickUpdate,
    }:
    {
        data: IPost[],
        handleClickDelete?: any,
        sections: ISection[],
        addPostToSection: any,
        handleClickUpdate: any
        loadingDelete: boolean
    }
) {
    const handleCheckCategory = useCallback((postId: string, sectionId: string) => {
        addPostToSection({
            sectionId,
            postId
        }, {
            onSuccess: () => {
                toast.success('Cập nhật thành công');
            }
        })
    }, [addPostToSection]);

    return <>
        <Table className={'text-base table-fixed'}>
            <TableHeader className={'bg-[#f5f5f590]'}>
                <TableRow className={'h-auto'}>
                    <TableHead className={'text-center w-10'}>Hình ảnh</TableHead>
                    <TableHead className={'pl-3 w-50'}>Tên</TableHead>
                    {
                        sections?.length > 0 ? sections?.map((item: ISection) => (
                            <TableHead
                                className={'text-center w-30 h-auto break-words whitespace-normal'}
                                key={item?._id}
                            >
                                {item.name}
                            </TableHead>
                        )) : ''
                    }
                    <TableHead className={'text-center w-40'}>Hành động</TableHead>
                </TableRow>
            </TableHeader>
        </Table>
        <div
            className={'min-h-[calc(100vh-205px)] max-h-[calc(100vh-205px)] overflow-y-auto border-b border-gray-200'}>
            <Table className={'text-base table-fixed'}>
                <TableBody>
                    {data.map((item: IPost, index: number) => {
                        return <TableRow key={item._id}>
                            <TableCell className={'h-20 w-10'}>
                                {
                                    item?.image_url ? <Image
                                        src={item?.image_url as string || '/logos/principles.png'}
                                        alt={item.title} width={0} height={0}
                                        sizes={'100vw'}
                                        style={{width: "100%", height: "100%"}}
                                        className={'object-cover'}
                                    /> : <i className={'text-gray-400'}>Không có</i>
                                }
                            </TableCell>
                            <TableCell
                                className={'font-medium whitespace-normal pl-4 w-50'}>{item.title}</TableCell>
                            {
                                sections?.length > 0 ? sections?.map((i: ISection) => {
                                    const postIds = new Set(i.post_ids as string[]);
                                    return <TableCell
                                        className={'font-medium pl-4 w-30 space-x-1 text-center [&>[role=checkbox]]:!size-5.5'}
                                        key={i._id}
                                    >
                                        <Checkbox
                                            className={'border-gray-400'}
                                            value={i._id}
                                            checked={postIds.has(item._id as string)}
                                            onCheckedChange={() => handleCheckCategory(item._id as string, i._id as string)}
                                        />
                                    </TableCell>
                                }) : ''
                            }
                            <TableCell className={'text-center w-40 space-x-4'}>
                                <Button onClick={() => handleClickUpdate(item)}><Pencil/>Sửa</Button>
                                <Button
                                    disabled={loadingDelete}
                                    className={'bg-red-500'}
                                    onClick={() => handleClickDelete(item._id)}
                                >
                                    {loadingDelete && <Loader2 className={'w-4 h-4 animate-spin'}/>}
                                    <Trash/>Xóa
                                </Button>
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </div>
    </>
}
