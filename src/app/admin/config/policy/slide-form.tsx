'use client'

import React, {useEffect, useMemo, useState} from "react";
import {setBreadcrumb} from "@/redux/slices/admin";
import {routes} from "@/constants/routes";
import {Loader2, Trash} from "lucide-react";
import {useConfig} from "@/app/admin/config/(hooks)/use-config";
import {useSaveConfig} from "@/app/admin/config/(hooks)/use-save-config";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/shadcn-io/dropzone";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {useDispatch} from "react-redux";
import {Checkbox} from "@/components/ui/checkbox";

const defaultDownload = {
    name: '',
    file_url: ''
}

export default function SlideForm({tab, pageTitle}: { tab: 'plan' | 'strategy', pageTitle: string }) {
    const [files, setFiles] = useState<File[] | undefined>();

    const dispatch = useDispatch();
    const {error, refetch, loading, config} = useConfig('policy');
    const [data, setData] = useState<any>({});
    const {mutate, loading: loadingUpdate, isSuccess, isError, error: errorUpdate} = useSaveConfig('policy');
    const {uploadFile, loading: loadingUpload} = useUploadFile();
    const pptLink = useMemo(() => {
        return config?.config?.policy[tab]?.draft_ppt_link as string || ''
    }, [config]);

    const handleSubmitPolicy = (res: any) => {
        mutate(res, {
            onSuccess: () => {
                toast.success('Cập nhật thành công');
            },
            onSettled: () => {
                setFiles(undefined);
            }
        })
    }

    const handleSubmit = () => {
        const formData = new FormData();
        let uploadFiles = [];
        if (files?.[0]) {
            uploadFiles.push({
                file: files[0],
                key: tab,
                type: 'raw',
            })
        }
        if (data[tab].downloads.some((i: any) => i.file_url)) {
            uploadFiles = [
                ...uploadFiles,
                ...data[tab].downloads.map((i: any, index: number) => ({
                    file: i.file_url,
                    key: `file_url.${index}`,
                    type: 'raw',
                }))
            ]
        }
        uploadFiles = uploadFiles.filter(item => typeof item.file !== 'string')
        if (uploadFiles.length > 0) {
            uploadFiles.forEach(uploadFile => {
                formData.append('file', uploadFile.file);
                formData.append('key', uploadFile.key);
                formData.append('type', uploadFile.type);
            })
            uploadFile(formData, {
                onSuccess: (res) => {
                    const files = res.data;
                    let newData = data;
                    for (let file of files) {
                        if (file.key.includes('.')) {
                            const [parent, index] = file.key.split('.');
                            newData = {
                                ...newData,
                                [tab]: {
                                    ...newData[tab as keyof typeof newData] as any,
                                    downloads: [
                                        ...(newData[tab as keyof typeof newData] as any).downloads.slice(0, index),
                                        {
                                            ...(newData[tab as keyof typeof newData] as any).downloads[index],
                                            file_url: file.url
                                        },
                                        ...(newData[tab as keyof typeof newData] as any).downloads.slice(index + 1)
                                    ]
                                }
                            }
                        } else {
                            newData = {
                                ...newData,
                                [tab]: {
                                    ...newData[tab as keyof typeof newData] as any,
                                    draft_ppt_link: file.url
                                }
                            }
                        }
                    }
                    handleSubmitPolicy(newData);
                },
            })
        } else {
            handleSubmitPolicy(data);
        }
    }

    const handleDrop = (files: File[]) => {
        setFiles(files);
    };

    const handleChangeData = (value: string) => {
        setData((prev: any) => ({
            ...prev,
            [tab]: {
                ...prev[tab],
                download_notification: value
            }
        }))
    }

    const handleChangeDownloads = (value: any, key: string, index: number) => {
        setData({
            ...data,
            [tab]: {
                ...data[tab],
                downloads: [
                    ...data[tab].downloads.slice(0, index),
                    {
                        ...data[tab].downloads[index],
                        [key]: value
                    },
                    ...data[tab].downloads.slice(index + 1)
                ]
            }
        })
    }

    const handleChangeFile = (file: any, index: number) => {
        setData({
            ...data,
            [tab]: {
                ...data[tab],
                downloads: [
                    ...data[tab].downloads.slice(0, index),
                    {
                        ...data[tab].downloads[index],
                        file_url: file
                    },
                    ...data[tab].downloads.slice(index + 1)
                ]
            }
        })
    }

    const handleChangeCheck = (checked: boolean) => {
        setData({
            ...data,
            [tab]: {
                ...data[tab],
                downloadable: checked
            }
        })
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: routes.HomeConfig},
            {title: 'Thông tin chính sách'},
            {title: pageTitle},
        ]))
    }, [pageTitle])

    useEffect(() => {
        if (config?.config?.policy) {
            setData(config.config.policy);
        }
    }, [config]);

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                <Button onClick={handleSubmit} disabled={loadingUpdate || loadingUpload}>
                    {(loadingUpdate || loadingUpload) &&
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Cập nhật
                </Button>
            </div>
        </div>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
            <>
                <div className="grid gap-2">
                    <Label htmlFor="download_notification"
                           className={'font-medium text-md'}>Nội dung thông báo tải
                        xuống</Label>
                    <Input
                        id="download_notification" placeholder="Nhập nội dung thông báo"
                        value={data[tab]?.download_notification || ''}
                        onChange={e => handleChangeData(e.target.value)}
                    />
                </div>
                <Separator className={'my-3 box-border px-8'}/>
                <div className={'w-full flex justify-between gap-10'}>
                    <div className={'flex flex-col w-1/2 gap-2'}>
                        {pptLink ?
                            <div className={'flex justify-between items-center'}>
                                <div className={'font-medium'}>
                                    Slide trình chiếu hiện tại:
                                    <a href={pptLink} className={'italic underline text-blue-500 ml-1'}
                                       target={'_blank'}>
                                        Dự thảo
                                    </a>
                                </div>
                                <div
                                    className={'text-[14px] justify-end gap-2 flex items-center mr-1 text-gray-600'}>
                                    Hiển thị tải xuống
                                    <Checkbox
                                        checked={data[tab]?.downloadable || false}
                                        onCheckedChange={checked => handleChangeCheck(checked as any)}
                                    />
                                </div>
                            </div> : <div className={'my-6 italic text-gray-500'}>
                                Chưa có dự thảo nào
                            </div>
                        }
                        <Dropzone
                            accept={{
                                "application/vnd.ms-powerpoint": [], // .ppt
                                "application/vnd.openxmlformats-officedocument.presentationml.presentation": [], // .pptx
                            }}
                            maxFiles={1}
                            maxSize={1024 * 1024 * 10}
                            minSize={1024}
                            onDrop={handleDrop}
                            onError={console.error}
                            src={files}
                            className={'h-[calc(100vh-400px)]'}
                        >
                            <DropzoneEmptyState/>
                            <DropzoneContent/>
                        </Dropzone>
                    </div>
                    <div
                        className={'w-1/2 flex flex-col gap-4 shadow-sm rounded-md box-border px-5 py-4 border border-gray-200'}>
                        <Label className={'flex justify-between w-full text-base'}>
                            <p className={'text-base'}>Quản lý tải xuống</p>
                            <div
                                className={'text-blue-500 cursor-pointer mr-3'}
                                onClick={() => {
                                    setData({
                                        ...data,
                                        [tab]: {
                                            ...data[tab] as any,
                                            downloads: [
                                                ...data[tab].downloads,
                                                defaultDownload
                                            ]
                                        }
                                    })
                                }}
                            >
                                + Thêm mới
                            </div>
                        </Label>
                        <div className={'flex flex-col gap-5'}>
                            {
                                data?.[tab]?.downloads?.map((item: any, index: number) => {
                                    const hasDownloadLink = typeof item.file_url === 'string' && item.file_url;
                                    return <div className={'flex flex-col gap-1'} key={index}>
                                        <p className={'font-medium'}>• Download {index + 1}</p>
                                        <div className={'flex items-center justify-between gap-4 mr-3'}>
                                            <div className={'flex items-center gap-4'}>
                                                <Input
                                                    className={`${hasDownloadLink ? 'w-1/3' : 'w-1/2'}`}
                                                    id="name" placeholder="Nhập tên tài liệu" value={item.name}
                                                    onChange={e => handleChangeDownloads(e.target.value, 'name', index)}
                                                />
                                                <input
                                                    onChange={(e) => handleChangeFile(e.target.files?.[0] || null, index)}
                                                    type={'file'}
                                                    className={`border px-3 rounded-sm h-9 border-gray-500 cursor-pointer ${hasDownloadLink ? 'w-1/3' : 'w-1/2'}`}
                                                />
                                                {
                                                    hasDownloadLink ?
                                                        <a href={item.file_url} className={'underline text-blue-400'}>File
                                                            hiện tại</a> : ''
                                                }
                                            </div>
                                            <Trash className={'text-red-400 w-6 h-6 cursor-pointer'}
                                                   onClick={() => {
                                                       setData({
                                                           ...data,
                                                           [tab]: {
                                                               ...data[tab] as any,
                                                               downloads: [
                                                                   ...data[tab].downloads.slice(0, index),
                                                                   ...data[tab].downloads.slice(index + 1)
                                                               ]
                                                           }
                                                       })
                                                   }}
                                            />
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </>
        }
    </>
}
