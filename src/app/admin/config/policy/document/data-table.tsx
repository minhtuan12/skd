'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {ChevronRight, Pencil} from "lucide-react";
import {IPolicyDocument} from "@/models/policy-document";
import Link from "next/link";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Pagination, PaginationContent, PaginationItem, PaginationLink} from "@/components/ui/pagination";

export default function DataTable(
    {data, handleClickEdit, handleClickDelete, handleChangeOrder, setPage, page, totalPages, total}:
    {
        data: IPolicyDocument[],
        handleClickEdit: any,
        handleClickDelete?: any,
        handleChangeOrder: any,
        setPage: any,
        page: number,
        totalPages: number,
        total: number
    }
) {
    const orderOptions = Array.from({length: total}, (_, idx) => (
        <SelectItem className={'!text-base'} key={idx} value={idx.toString()}>
            {idx + 1}
        </SelectItem>
    ))

    return <>
        <Table className={'text-base'}>
            <TableHeader className={'bg-[#f5f5f590]'}>
                <TableRow>
                    <TableHead className={'text-center w-10'}>Ưu tiên</TableHead>
                    <TableHead className={'text-center w-20'}>Hình ảnh</TableHead>
                    <TableHead className={'pl-4 w-145'}>Chính sách</TableHead>
                    <TableHead className={'w-40 text-center'}>Slide</TableHead>
                    <TableHead className={'w-40 text-center'}>PDF</TableHead>
                    <TableHead className={'w-40 text-center'}>Link nội dung</TableHead>
                    <TableHead className={'text-center w-40'}>Hành động</TableHead>
                </TableRow>
            </TableHeader>
        </Table>
        <div className={'min-h-[calc(100vh-265px)] max-h-[calc(100vh-265px)] overflow-y-auto border-b border-gray-200'}>
            <Table>
                <TableBody>
                    {data.map((item: IPolicyDocument, index: number) => (
                        <TableRow key={item._id}>
                            <TableCell className={'text-center w-10'}>
                                <Select
                                    value={(item.order as number).toString()}
                                    onValueChange={value => {
                                        handleChangeOrder(item._id as string, item.order as number, Number(value))
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
                            <TableCell className={'w-20 h-20'}>
                                <Image
                                    src={item.image_url as string}
                                    alt={item.title} width={0} height={0}
                                    sizes={'100vw'}
                                    style={{width: "100%", height: "100%"}}
                                    className={'object-cover'}
                                />
                            </TableCell>
                            <TableCell className={'font-medium whitespace-normal pl-4 w-145 text-base'}>{item.title}</TableCell>
                            <TableCell className={'text-gray-500 whitespace-normal pl-7 text-center w-40 text-base'}>
                                {
                                    item.slide.url ?
                                        <Link className={'underline text-blue-500'} href={item.slide.url}>
                                            Tải xuống slide
                                        </Link> :
                                        <i>Không có</i>
                                }
                            </TableCell>
                            <TableCell className={'text-gray-500 whitespace-normal pl-7 text-center w-40 text-base'}>
                                {
                                    item.pdf.url ?
                                        <Link className={'underline text-blue-500'} href={item.pdf.url}>
                                            Tải xuống PDF
                                        </Link> :
                                        <i>Không có</i>
                                }
                            </TableCell>
                            <TableCell className={'text-gray-500 whitespace-normal pl-7 text-center w-40 text-base'}>
                                {
                                    item.link ?
                                        <Link className={'underline text-blue-500'} href={item.link}>
                                            Xem link
                                        </Link> :
                                        <i>Không có</i>
                                }
                            </TableCell>
                            <TableCell className={'text-center space-x-4 w-40'}>
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
        </div>
        <div className={'mt-2.5 justify-between flex flex-wrap items-center'}>
            <div className={'w-fit text-lg'}>Tổng số: <b>{total}</b></div>
            <Pagination className={'w-fit mx-0'}>
                <PaginationContent>
                    {Array.from({length: totalPages}, (_, i) => (
                        <PaginationItem key={i} onClick={() => setPage(i + 1)}>
                            <PaginationLink isActive={page === i + 1}>
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem onClick={() => {
                        if (page + 1 <= totalPages) {
                            setPage(page + 1)
                        }
                    }}>
                        <PaginationLink>
                            <ChevronRight/>
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    </>
}
