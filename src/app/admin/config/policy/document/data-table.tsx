'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {IPolicyDocument} from "@/models/policy-document";
import Link from "next/link";

export default function DataTable(
    {data, handleClickEdit, handleClickDelete}:
    { data: IPolicyDocument[], handleClickEdit: any, handleClickDelete?: any }
) {
    return <Table className={'text-base'}>
        <TableHeader className={'bg-[#f5f5f590]'}>
            <TableRow>
                <TableHead className={'text-center w-16'}>STT</TableHead>
                <TableHead className={'text-center w-80'}>Hình ảnh</TableHead>
                <TableHead className={'pl-4 w-60'}>Chính sách</TableHead>
                <TableHead className={'pl-4 w-40'}>Nội dung</TableHead>
                <TableHead className={'pl-4 w-60 text-center'}>Slide</TableHead>
                <TableHead className={'pl-4 w-60 text-center'}>PDF</TableHead>
                <TableHead className={'pl-4 w-60 text-center'}>Link nội dung</TableHead>
                <TableHead className={'text-center w-80'}>Hành động</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item: IPolicyDocument, index: number) => (
                <TableRow key={item._id}>
                    <TableCell className={'text-center'}>{index + 1}</TableCell>
                    <TableCell className={'h-[170px]'}>
                        <Image
                            src={item.image_url as string}
                            alt={item.title} width={0} height={0}
                            sizes={'100vw'}
                            style={{width: "100%", height: "100%"}}
                            className={'object-cover'}
                        />
                    </TableCell>
                    <TableCell className={'font-medium whitespace-normal pl-4'}>{item.title}</TableCell>
                    <TableCell className={'text-gray-500 whitespace-normal line-clamp-4'}>
                        {item.text ? <div className={'prose'} dangerouslySetInnerHTML={{__html: item.text}}/> : <i className={'relative top-1/2'}>Không có</i>}
                    </TableCell>
                    <TableCell className={'text-gray-500 whitespace-normal pl-4 text-center'}>
                        {
                            item.slide.url ?
                                <Link className={'underline text-blue-500'} href={item.slide.url}>
                                    Tải xuống slide
                                </Link> :
                                <i>Không có</i>
                        }
                    </TableCell>
                    <TableCell className={'text-gray-500 whitespace-normal pl-4 text-center'}>
                        {
                            item.pdf.url ?
                                <Link className={'underline text-blue-500'} href={item.pdf.url}>
                                    Tải xuống PDF
                                </Link> :
                                <i>Không có</i>
                        }
                    </TableCell>
                    <TableCell className={'text-gray-500 whitespace-normal pl-4 text-center'}>
                        {
                            item.link ?
                                <Link className={'underline text-blue-500'} href={item.link}>
                                    Xem link
                                </Link> :
                                <i>Không có</i>
                        }
                    </TableCell>
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
