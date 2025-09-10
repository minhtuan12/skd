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

export default function DataTable(
    {data, handleClickEdit, handleClickDelete}:
    { data: IKnowledge[], handleClickEdit: any, handleClickDelete?: any }
) {
    return <Table className={'text-base'}>
        <TableHeader className={'bg-[#f5f5f590]'}>
            <TableRow>
                <TableHead className={'text-center w-16'}>STT</TableHead>
                <TableHead className={'text-center w-70'}>Hình ảnh</TableHead>
                <TableHead className={'pl-4 w-100'}>Tên</TableHead>
                <TableHead className={'pl-4'}>Nhóm vấn đề</TableHead>
                <TableHead className={'w-60 text-center'}>Ngày đăng</TableHead>
                <TableHead className={'text-center w-80'}>Hành động</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item: IKnowledge, index: number) => {
                const firstItemCate: IKnowledgeCategory = (item.category as IKnowledgeCategory[])[0];
                const isChild = !firstItemCate.is_parent;

                return <TableRow key={item._id}>
                    <TableCell className={'text-center'}>{index + 1}</TableCell>
                    <TableCell className={'h-[170px]'}>
                        {item.media?.media_type === 'image' ? <Image
                            src={item?.media?.url as string}
                            alt={item.name} width={0} height={0}
                            sizes={'100vw'}
                            style={{width: "100%", height: "100%"}}
                            className={'object-cover'}
                        /> : <VideoPlayer src={item?.media?.url as string}/>
                        }
                    </TableCell>
                    <TableCell className={'font-medium whitespace-normal pl-4'}>{item.name}</TableCell>
                    <TableCell className={'font-medium whitespace-normal pl-4'}>
                        {
                            isChild ?
                                item.category.map(i => (i as IKnowledgeCategory).name).join(', ') :
                                firstItemCate.name
                        }
                    </TableCell>
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
            })}
        </TableBody>
    </Table>
}
