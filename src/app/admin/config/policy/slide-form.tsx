'use client'

import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setBreadcrumb} from "@/redux/slices/admin";
import {routes} from "@/constants/routes";
import {Loader2} from "lucide-react";
import {useConfig} from "@/app/admin/config/(hooks)/use-config";
import {useSaveConfig} from "@/app/admin/config/(hooks)/use-save-config";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {RootState} from "@/redux/store";
import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/shadcn-io/dropzone";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {setPolicies} from "@/redux/slices/policy";
import {Separator} from "@/components/ui/separator";

export default function SlideForm({tab, pageTitle}: { tab: 'plan' | 'strategy', pageTitle: string }) {
    const policies = useSelector((state: RootState) => state.policy.policies);
    const [files, setFiles] = useState<File[] | undefined>();
    const pptLink = (policies[tab as keyof typeof policies] as any)?.draft_ppt_link as string || '';
    const dispatch = useDispatch();
    const {error, refetch, loading} = useConfig('policy');
    const {mutate, loading: loadingUpdate, isSuccess, isError, error: errorUpdate} = useSaveConfig('policy');
    const {uploadFile, loading: loadingUpload} = useUploadFile();

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: routes.HomeConfig},
            {title: 'Thông tin chính sách'},
            {title: pageTitle},
        ]))
    }, [pageTitle])

    const handleSubmitPolicy = (res: any) => {
        if (res?.url) {
            mutate({
                ...policies,
                [tab]: {
                    ...policies[tab as keyof typeof policies] as any,
                    download_notification: (policies[tab as keyof typeof policies] as any).download_notification,
                    draft_ppt_link: res.url,
                }
            }, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                },
                onSettled: () => {
                    setFiles(undefined);
                }
            })
        } else {
            mutate({
                ...policies,
                [tab]: {
                    ...policies[tab as keyof typeof policies] as any,
                    download_notification: (policies[tab as keyof typeof policies] as any).download_notification,
                }
            }, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                }
            })
        }
    }

    const handleSubmit = () => {
        if (files?.[0]) {
            const formData = new FormData();
            let uploadedFile = {
                file: files[0],
                key: tab,
                type: 'raw',
            }

            formData.append('file', uploadedFile.file);
            formData.append('key', uploadedFile.key);
            formData.append('type', uploadedFile.type);

            uploadFile(formData, {
                onSuccess: (res) => {
                    handleSubmitPolicy(res.data[0]);
                },
            })
        } else {
            handleSubmitPolicy(null);
        }
    }

    const handleDrop = (files: File[]) => {
        setFiles(files);
    };

    const handleChangeData = (value: string) => {
        dispatch(setPolicies({
            ...policies,
            [tab]: {
                ...policies[tab as keyof typeof policies] as any,
                download_notification: value
            }
        }))
    }

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
                        value={(policies[tab as keyof typeof policies] as any)?.download_notification || ''}
                        onChange={e => handleChangeData(e.target.value)}
                    />
                </div>
                <Separator className={'my-3 box-border px-8'}/>
                {pptLink ?
                    <div className={'font-medium'}>
                        Dự thảo hiện tại:
                        <a href={pptLink} className={'italic underline text-blue-500 ml-1'}
                           target={'_blank'}>
                            Dự thảo
                        </a>
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
                    className={'h-[calc(100vh-500px)] -mt-2'}
                >
                    <DropzoneEmptyState/>
                    <DropzoneContent/>
                </Dropzone>
            </>
        }
    </>
}
