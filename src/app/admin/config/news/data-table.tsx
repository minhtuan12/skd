'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Loader2, Pencil, Trash} from "lucide-react";
import React from "react";
import {INewsAndEvents} from "@/models/config";
import Image from "next/image";
import {Checkbox} from "@/components/ui/checkbox";
import {useUpdateEventOrder} from "@/app/admin/config/(hooks)/use-update-event-order";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";

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
    const {mutate: updateOrder, loading} = useUpdateEventOrder(tab);
    const orderOptions = Array.from({length: data.length}, (_, idx) => (
        <SelectItem className={'!text-base'} key={idx} value={idx.toString()}>
            {idx + 1}
        </SelectItem>
    ))

    function handleChangeOrder(itemId: string, oldOrder: number, newOrder: number) {
        updateOrder({eventId: itemId, newOrder, oldOrder}, {
            onSuccess: () => {
                toast.success('Cập nhật thành công');
            }
        })
    }

    return loading ? <Loader2 className={'animate-spin w-4 h-4'}/> : <Table className={'text-base'}>
        <TableHeader className={'bg-[#f5f5f590]'}>
            <TableRow>
                <TableHead className={'text-center w-16'}>
                    {tab === 'event' ? "Ưu tiên" : "STT"}
                </TableHead>
                <TableHead className={'text-center w-20'}>Hình ảnh</TableHead>
                <TableHead className={'pl-4'}>Tiêu đề</TableHead>
                {tab === 'news' ? <TableHead className={'w-60 text-center'}>Highlight</TableHead> : ''}
                <TableHead className={'text-center w-80'}>Hành động</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item: INewsAndEvents, index: number) => (
                <TableRow key={item._id}>
                    <TableCell className={'text-center'}>
                        {tab === 'event' ?
                            <Select
                                value={(item.order as number).toString()}
                                onValueChange={value => {
                                    handleChangeOrder(
                                        item._id as string,
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
                            </Select> : index + 1
                        }
                    </TableCell>
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
