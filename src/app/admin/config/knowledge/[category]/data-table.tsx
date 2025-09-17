'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatDate} from "@/lib/utils";
import React from "react";
import Image from "next/image";
import {IKnowledge} from "@/models/knowledge";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {VideoPlayer} from "@/components/ui/video";
import {IKnowledgeCategory} from "@/models/knowledge-category";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function DataTable(
    {data, handleClickEdit, handleClickDelete, handleChangeOrder}:
    { data: IKnowledge[], handleClickEdit: any, handleClickDelete?: any, handleChangeOrder: any }
) {
    const orderOptions = Array.from({length: data.length}, (_, idx) => (
        <SelectItem className={'!text-base'} key={idx} value={idx.toString()}>
            {idx + 1}
        </SelectItem>
    ))

    return <Table className={'text-base'}>
        <TableHeader className={'bg-[#f5f5f590]'}>
            <TableRow>
                <TableHead className={'text-center w-10'}>Ưu tiên</TableHead>
                <TableHead className={'text-center w-20'}>Hình ảnh</TableHead>
                <TableHead className={'pl-4 w-100'}>Tên</TableHead>
                <TableHead className={'pl-4'}>Nhóm vấn đề</TableHead>
                <TableHead className={'w-60 text-center'}>Ngày đăng</TableHead>
                <TableHead className={'text-center w-80'}>Hành động</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item: any, index: number) => {
                const knowledge = item?.knowledge as IKnowledge;
                return <TableRow key={index}>
                    <TableCell className={'text-center w-10'}>
                        <Select
                            value={(item.order as number).toString()}
                            onValueChange={value => {
                                handleChangeOrder(
                                    knowledge._id as string,
                                    item.categories.map((x: any) => x._id),
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
                        {knowledge.media?.media_type === 'image' ? <Image
                            src={knowledge?.media?.url as string}
                            alt={knowledge.name} width={0} height={0}
                            sizes={'100vw'}
                            style={{width: "100%", height: "100%"}}
                            className={'object-cover'}
                        /> : <VideoPlayer src={knowledge?.media?.url as string}/>
                        }
                    </TableCell>
                    <TableCell className={'font-medium whitespace-normal pl-4'}>{knowledge.name}</TableCell>
                    <TableCell className={'font-medium whitespace-normal pl-4'}>
                        {
                            (item?.categories || [])?.map((i: any) => (i as IKnowledgeCategory).name).join(', ')
                        }
                    </TableCell>
                    <TableCell className={'text-center'}>{formatDate(knowledge.createdAt as string)}</TableCell>
                    <TableCell className={'text-center space-x-4'}>
                        <Button onClick={() => handleClickEdit(knowledge)}><Pencil/>Sửa</Button>
                        {/*<Button onClick={() => handleClickDelete(item)}*/}
                        {/*        className={`text-white ${!item.is_deleted ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}*/}
                        {/*        disabled={loadingUpdate}*/}
                        {/*>*/}
                        {/*    {loadingUpdate ? <Loader2 className={'animate-spin'}/> : ''}*/}
                        {/*    <Eye/>{item.is_deleted ? 'Hiện tin' : 'Ẩn tin'}*/}
                        {/*</Button>*/}
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>
}
