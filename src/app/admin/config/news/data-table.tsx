'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Loader2, Pencil, Trash} from "lucide-react";
import React from "react";
import {INewsAndEvents} from "@/models/config";
import Image from "next/image";
import {Checkbox} from "@/components/ui/checkbox";

export default function DataTable(
    {
        data, handleClickEdit, handleClickDelete, loadingUpdate, loadingDelete, deletedId, tab,
        handleCheckHighlight
    }:
    {
        data: INewsAndEvents[],
        handleClickEdit: any,
        handleClickDelete: any,
        loadingUpdate: boolean,
        loadingDelete: boolean,
        deletedId: any,
        tab: string,
        handleCheckHighlight: any
    }
) {
    const fullHighlight = (data.filter((i: any) => i.is_highlight))?.length === 3;
    return <Table className={'text-base'}>
        <TableHeader className={'bg-[#f5f5f590]'}>
            <TableRow>
                <TableHead className={'text-center w-16'}>STT</TableHead>
                <TableHead className={'text-center w-20'}>Hình ảnh</TableHead>
                <TableHead className={'pl-4'}>Tiêu đề</TableHead>
                {tab === 'news' ? <TableHead className={'w-60 text-center'}>Highlight</TableHead> : ''}
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
                    {tab === 'news' ?
                        <TableCell className={'text-center'}>
                            <Checkbox
                                disabled={!item.is_highlight && fullHighlight}
                                className={'border-gray-400 size-4.5'}
                                value={item._id}
                                checked={item.is_highlight}
                                onCheckedChange={() => handleCheckHighlight(item._id)}
                            />
                        </TableCell> : ''
                    }
                    <TableCell className={'text-center space-x-4'}>
                        <Button onClick={() => handleClickEdit(item)}><Pencil/>Sửa</Button>
                        <Button onClick={() => handleClickDelete(item)}
                                className={`text-white bg-red-500 hover:bg-red-600`}
                                disabled={(loadingDelete && item._id === deletedId)}
                        >
                            {(loadingDelete && item._id === deletedId) ? <Loader2 className={'animate-spin'}/> : ''}
                            <Trash/> Xóa
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}
