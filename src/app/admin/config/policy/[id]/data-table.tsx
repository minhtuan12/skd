'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatDate} from "@/lib/utils";
import React from "react";
import Image from "next/image";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {IPost} from "@/models/post";

export default function DataTable(
    {data, handleChangeOrder}:
    { data: IPost[], handleChangeOrder?: any }
) {
    const orderOptions = Array.from({length: data.length}, (_, idx) => (
        <SelectItem className={'!text-base'} key={idx} value={idx.toString()}>
            {idx + 1}
        </SelectItem>
    ))

    return <Table className={'text-base table-fixed'}>
        <TableHeader className={'bg-[#f5f5f590]'}>
            <TableRow>
                {/*<TableHead className={'text-center w-10'}>Ưu tiên</TableHead>*/}
                <TableHead className={'text-center w-20'}>Hình ảnh</TableHead>
                <TableHead className={'pl-4 w-100'}>Tên</TableHead>
                <TableHead className={'w-60 text-center'}>Ngày đăng</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item: any, index: number) => {
                return <TableRow key={index}>
                    {/*<TableCell className={'text-center w-10'}>*/}
                    {/*    <Select*/}
                    {/*        value={(item.order as number).toString()}*/}
                    {/*        onValueChange={value => {*/}
                    {/*            handleChangeOrder(*/}
                    {/*                item._id,*/}
                    {/*                item.order as number,*/}
                    {/*                Number(value)*/}
                    {/*            )*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <SelectTrigger className="bg-white !text-base">*/}
                    {/*            <SelectValue/>*/}
                    {/*        </SelectTrigger>*/}
                    {/*        <SelectContent>*/}
                    {/*            {orderOptions}*/}
                    {/*        </SelectContent>*/}
                    {/*    </Select>*/}
                    {/*</TableCell>*/}
                    <TableCell className={'h-20 w-20'}>
                        {
                            item?.image_url ? <Image
                                src={item?.image_url as string}
                                alt={item.title} width={0} height={0}
                                sizes={'100vw'}
                                style={{width: "100%", height: "100%"}}
                                className={'object-cover'}
                            /> : 'Không có'
                        }
                    </TableCell>
                    <TableCell className={'font-medium whitespace-normal pl-4'}>{item.title}</TableCell>
                    <TableCell className={'text-center'}>{formatDate(item.createdAt as string)}</TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>
}
