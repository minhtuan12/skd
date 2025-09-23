'use client'

import {ISection, SectionType} from "@/models/section";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useUpdateSection} from "@/app/admin/config/pages/(hooks)/use-update-section";
import {Loader2, Trash} from "lucide-react";
import {toast} from "sonner";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import {Separator} from "@/components/ui/separator";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {useUpdateOneSection} from "@/app/admin/config/pages/(hooks)/use-update-one-section";
import {useDeleteSection} from "@/app/admin/config/pages/(hooks)/use-delete-section";

export default function ({data, setSelectedSection}: {
    data: ISection & { isDefault?: boolean, key: string },
    setSelectedSection: any
}) {
    const [pages, setPages] = useState(data?.children || []);
    const [page, setPage] = useState(data);
    const [imageUrl, setImageUrl] = useState('');

    const {mutate: updateSection, loading} = useUpdateSection();
    const {uploadFile, loading: loadingUpload} = useUploadFile();
    const {mutate: updateOneSection, loading: loadingUpdateOne} = useUpdateOneSection();
    const {mutate: deleteSection, loading: loadingDelete} = useDeleteSection();

    function handleChangePageName(value: string | boolean, key: string, index: number) {
        setPages((prev) => [
            ...prev.slice(0, index),
            {...prev[index], [key]: value},
            ...prev.slice(index + 1)
        ] as any);
    }

    function handleSelect(type: string, index: number) {
        setPages((prev) => [
            ...prev.slice(0, index),
            {...prev[index], type},
            ...prev.slice(index + 1)
        ] as any);
    }

    const handleChangeImage = (e: any) => {
        if (typeof e !== 'string') {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onloadend = () => {
                    setPage((prev: any) => ({
                        ...prev,
                        image_url: file
                    }))
                    setImageUrl(reader.result as string);
                }
                reader.readAsDataURL(file)
            }
        } else {
            setPage((prev: any) => ({
                ...prev,
                image_url: e
            }))
            setImageUrl(e as string);
        }
    }

    function submit() {
        if (data?.isDefault) {
            updateSection(pages, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công')
                    setSelectedSection(null);
                }
            });
        } else {
            if (typeof page.image_url !== 'string') {
                const formData = new FormData();
                let uploadedFile = {
                    file: page.image_url,
                    key: `image_url`,
                    type: 'image',
                }

                formData.append('file', uploadedFile.file);
                formData.append('key', uploadedFile.key);
                formData.append('type', uploadedFile.type);

                uploadFile(formData, {
                    onSuccess: (res) => {
                        let clone = page;
                        clone = {
                            ...clone,
                            image_url: res.data[0].url
                        }
                        updateOneSection(page.type === SectionType['section'] ? {...clone, children: pages} : clone, {
                            onSuccess: () => {
                                toast.success('Cập nhật thành công');
                                setImageUrl('');
                                setSelectedSection(null);
                            }
                        });
                    },
                })
            } else {
                updateOneSection(page.type === SectionType['section'] ? {...page, children: pages} : page, {
                    onSuccess: () => {
                        toast.success('Cập nhật thành công')
                        setSelectedSection(null);
                    }
                });
            }
        }
    }

    useEffect(() => {
        setPages(data?.children || []);
        setPage(data);
    }, [data]);

    return <div className={'flex flex-col gap-3'}>
        <div className={'flex justify-between items-center font-semibold text-xl'}>
            {data.name}
            <div className={'flex gap-4'}>
                {(data?.isDefault || data.type === SectionType['section']) ? <Button
                    onClick={() => {
                        setPages(prev => [...prev, {
                            name: '',
                            is_deleted: false,
                            header_key: data.key || data.header_key
                        }] as any)
                    }}
                    className={'bg-white border border-black text-black hover:bg-gray-50'}
                >
                    Thêm trang</Button> : ''}
                <Button onClick={submit} disabled={loading || loadingUpload || loadingUpdateOne}>
                    {(loading || loadingUpload || loadingUpdateOne) &&
                        <Loader2 className={'w-4 h-4 animate-spin'}/>} Cập nhật
                </Button>
            </div>
        </div>

        <div className={'max-h-[calc(100vh-250px)] overflow-y-auto'}>
            {
                !data?.isDefault ?
                    <div className={'box-border lg:px-40 md:px-20 px-0'}>
                        <UploadFile
                            url={(imageUrl && imageUrl !== '/') ? imageUrl : page.image_url as string}
                            handleChangeFile={handleChangeImage} inputValue={''}
                        />
                    </div> : ''
            }

            {data.type === SectionType['section'] && <Separator className={'mt-3'}/>}

            {/* Table of pages */}
            {
                (data?.isDefault || data.type === SectionType['section']) ?
                    <div className={'flex flex-col gap-3 mt-3'}>
                        <div className={'font-medium text-base'}>Các trang con</div>
                        <Table className={'text-base'}>
                            <TableHeader className={'bg-[#f5f5f590]'}>
                                <TableRow>
                                    <TableHead className={'text-center'}>STT</TableHead>
                                    <TableHead>Tên trang</TableHead>
                                    <TableHead>Loại trang</TableHead>
                                    <TableHead className={'text-center'}>Hiển thị</TableHead>
                                    <TableHead className={'text-center'}></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.map((item: ISection, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell
                                            className="font-medium text-center">{index + 1}</TableCell>
                                        <TableCell className="font-medium">
                                            <Input
                                                id="name"
                                                value={item.name}
                                                onChange={(e: any) => handleChangePageName(e.target.value, 'name', index)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Select
                                                value={item.type || SectionType['post']}
                                                onValueChange={value => handleSelect(value, index)}
                                            >
                                                <SelectTrigger className="w-[200px] bg-white !text-base">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={SectionType['post']}>
                                                        Bài viết
                                                    </SelectItem>
                                                    <SelectItem value={SectionType['section']}>
                                                        Mục lục
                                                    </SelectItem>
                                                    <SelectItem value={SectionType['list']}>
                                                        Danh sách bài viết
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <Checkbox
                                                value={item._id}
                                                checked={!item.is_deleted}
                                                onCheckedChange={(e) => handleChangePageName(!e, 'is_deleted', index)}
                                            />
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            {
                                                item._id ? <Button
                                                    disabled={loadingDelete}
                                                    className={'bg-red-500'}
                                                    onClick={() => {
                                                        deleteSection(item._id, {
                                                            onSuccess: () => {
                                                                toast.success('Xóa thành công');
                                                                setSelectedSection(null);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    {loadingDelete && <Loader2 className={'w-4 h-4 animate-spin'}/>}
                                                    <Trash/>Xóa
                                                </Button> : ''
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div> : ''
            }
        </div>
    </div>
}
