'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatDate} from "@/lib/utils";
import React from "react";
import Image from "next/image";
import {IKnowledge, KnowledgeType, KnowledgeTypes} from "@/models/knowledge";
import {ITreeType} from "@/models/tree-type";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {VideoPlayer} from "@/components/ui/video";

export default function DataTable(
    {data, handleClickEdit, handleClickDelete, category}:
    { data: IKnowledge[], handleClickEdit: any, handleClickDelete?: any, category: KnowledgeType }
) {
    const notTechnique = category === KnowledgeTypes.model || category === KnowledgeTypes.training;

    return <Table className={'text-base'}>
        <TableHeader className={'bg-[#f5f5f590]'}>
            <TableRow>
                <TableHead className={'text-center w-16'}>STT</TableHead>
                <TableHead className={'text-center w-70'}>Hình ảnh {notTechnique ? '/Video' : ''}</TableHead>
                {
                    !notTechnique ? <>
                        <TableHead className={'pl-4'}>Tên kỹ thuật</TableHead>
                        <TableHead className={'pl-4'}>Nhóm cây</TableHead>
                    </> : <TableHead className={'w-200'}>Giới thiệu</TableHead>
                }
                <TableHead className={'w-60 text-center'}>Ngày đăng</TableHead>
                <TableHead className={'text-center w-80'}>Hành động</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item: IKnowledge, index: number) => (
                <TableRow key={item._id}>
                    <TableCell className={'text-center'}>{index + 1}</TableCell>
                    <TableCell className={'h-[170px]'}>
                        {item.media?.media_type === 'image' ? <Image
                            src={item?.media?.url as string}
                            alt={!notTechnique ? item?.name as string : item.description as string} width={0} height={0}
                            sizes={'100vw'}
                            style={{width: "100%", height: "100%"}}
                            className={'object-cover'}
                        /> : <VideoPlayer src={item?.media?.url as string}/>
                        }
                    </TableCell>
                    {
                        !notTechnique ? <>
                            <TableCell className={'font-medium whitespace-normal pl-4'}>{item.name}</TableCell>
                            <TableCell className={'font-medium whitespace-normal pl-4'}>
                                {(item.tree_type as ITreeType)?.name}
                            </TableCell>
                        </> : <TableCell className={'font-medium whitespace-normal pl-4'}>
                            <div className={'line-clamp-4'} dangerouslySetInnerHTML={{__html: item.description as string}}/>
                        </TableCell>
                    }
                    <TableCell className={'text-center'}>{formatDate(item.createdAt as string)}</TableCell>
                    <TableCell className={'text-center space-x-4'}>
                        <Button onClick={() => handleClickEdit(item)}><Pencil/>Sửa</Button>
                        {/*<Button onClick={() => handleClickDelete(item)}*/}
                        {/*        className={`text-white ${!item.is_deleted ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}*/}
                        {/*        disabled={loadingUpdate}*/}
                        {/*>*/}
                        {/*    {loadingUpdate ? <Loader2 className={'animate-spin'}/> : ''}*/}
                        {/*    <Eye/>{item.is_deleted ? 'Hiện tin' : 'Ẩn tin'}*/}
                        {/*</Button>*/}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}
