'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatDate} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Eye, Loader2, Pencil} from "lucide-react";
import React from "react";
import {INewsAndEvents} from "@/models/config";
import Image from "next/image";

export default function DataTable(
    {data, handleClickEdit, handleClickDelete, loadingUpdate}:
    { data: INewsAndEvents[], handleClickEdit: any, handleClickDelete: any, loadingUpdate: boolean }
) {
    return <Table className={'text-base'}>
        <TableHeader className={'bg-[#f5f5f590]'}>
            <TableRow>
                <TableHead className={'text-center w-16'}>STT</TableHead>
                <TableHead className={'text-center w-20'}>Hình ảnh</TableHead>
                <TableHead className={'pl-4'}>Tiêu đề</TableHead>
                <TableHead className={'w-60 text-center'}>Ngày đăng</TableHead>
                <TableHead className={'text-center w-80'}>Hành động</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item: INewsAndEvents, index: number) => (
                <TableRow key={item._id}>
                    <TableCell className={'text-center'}>{index + 1}</TableCell>
                    <TableCell className={'h-20'}>
                        <Image
                            src={item.image_url as string} alt={item.title} width={0} height={0} sizes={'100vw'}
                            style={{width: "100%", height: "100%"}}
                            className={'object-cover'}
                        />
                    </TableCell>
                    <TableCell className={'font-medium whitespace-normal pl-4'}>{item.title}</TableCell>
                    <TableCell className={'text-center'}>{formatDate(item.createdAt as string)}</TableCell>
                    <TableCell className={'text-center space-x-4'}>
                        <Button onClick={() => handleClickEdit(item)}><Pencil/>Sửa</Button>
                        <Button onClick={() => handleClickDelete(item)}
                                className={`text-white ${!item.is_deleted ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                                disabled={loadingUpdate}
                        >
                            {loadingUpdate ? <Loader2 className={'animate-spin'}/> : ''}
                            <Eye/>{item.is_deleted ? 'Hiện tin' : 'Ẩn tin'}
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}
