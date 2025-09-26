'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Loader2, Pencil, Trash} from "lucide-react";
import {IPost} from "@/models/post";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function DataTable(
    {
        data,
        handleClickDelete,
        loadingDelete,
        handleClickUpdate,
        handleChangeOrder
    }:
    {
        data: IPost[],
        handleClickDelete?: any,
        handleClickUpdate: any
        loadingDelete: boolean,
        handleChangeOrder: any
    }
) {
    const orderOptions = Array.from({length: data.length}, (_, idx) => (
        <SelectItem className={'!text-base'} key={idx} value={idx.toString()}>
            {idx + 1}
        </SelectItem>
    ))

    return <>
        <Table className={'text-base table-fixed'}>
            <TableHeader className={'bg-[#f5f5f590]'}>
                <TableRow className={'h-auto'}>
                    <TableHead className={'text-center w-10'}>Ưu tiên</TableHead>
                    <TableHead className={'text-center w-20'}>Hình ảnh</TableHead>
                    <TableHead className={'pl-3 w-100'}>Tên</TableHead>
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
                            <TableCell className={'text-center w-10'}>
                                <Select
                                    value={(item.order as number).toString()}
                                    onValueChange={value => {
                                        handleChangeOrder(
                                            item._id,
                                            item.order as number,
                                            Number(value)
                                        )
                                    }}
                                >
                                    <SelectTrigger className="bg-white !text-base">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orderOptions}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className={'h-20 w-20'}>
                                {
                                    item?.image_url ? <Image
                                        src={item?.image_url as string}
                                        alt={item.title} width={0} height={0}
                                        sizes={'100vw'}
                                        style={{width: "100%", height: "100%"}}
                                        className={'object-cover'}
                                    /> : <i className={'text-gray-400'}>Không có</i>
                                }
                            </TableCell>
                            <TableCell className={'w-100'}>
                                {item.title}
                            </TableCell>
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
