'use client'

import React, {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setBreadcrumb, setPageTitle} from "@/redux/slices/admin";
import {routes} from "@/constants/routes";
import {Loader2} from "lucide-react";
import {useConfig} from "@/app/admin/config/(hooks)/use-config";
import {AdminButtonContext} from "@/contexts/AdminButtonContext";
import {useSaveConfig} from "@/app/admin/config/(hooks)/use-save-config";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RootState} from "@/redux/store";
import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/shadcn-io/dropzone";
import {toast} from "sonner";

const tabs = ['strategy', 'plan', 'document'];

export default function PolicyConfig() {
    const [currentTab, setCurrentTab] = useState('strategy');
    const policies = useSelector((state: RootState) => state.policy.policies);
    const [files, setFiles] = useState<File[] | undefined>();
    const pptLink = (policies[currentTab as keyof typeof policies] as any)?.draft_ppt_link as string || '';
    const mutableRef = useRef({
        currentTab,
        policies,
        files: files
    });
    const dispatch = useDispatch();

    const {setHandlers, setLoading} = useContext(AdminButtonContext);
    const {error, refetch, loading} = useConfig('policy');
    const {mutate, loading: loadingUpdate, isSuccess, isError, error: errorUpdate} = useSaveConfig('policy');
    const {uploadFile} = useUploadFile();

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: routes.HomeConfig},
            {title: 'Thông tin chính sách'}
        ]))
        dispatch(setPageTitle('Thông tin chính sách'))
        setHandlers({
            submitText: 'Cập nhật',
            visibleReset: false,
            reset: () => {
            },
            submit: handleSubmit
        })
    }, [])

    useEffect(() => {
        mutableRef.current = {
            currentTab,
            policies,
            files
        };
    }, [policies, files, currentTab]);

    const handleSubmitPolicy = (res: any) => {
        const data = mutableRef.current;
        const key = data.currentTab;

        if (res.url) {
            mutate({
                ...data.policies,
                [key]: {
                    ...data.policies[key as keyof typeof policies] as any,
                    draft_ppt_link: res.url,
                }
            }, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                },
                onSettled: () => {
                    setLoading(false);
                    setFiles(undefined);
                }
            })
        }
    }

    const handleSubmit = () => {
        const data = mutableRef.current;
        if (data.files?.[0]) {
            setLoading(true);
            const formData = new FormData();
            let uploadedFile = {
                file: data.files[0],
                key: data.currentTab,
                type: 'raw',
            }

            formData.append('file', uploadedFile.file);
            formData.append('key', uploadedFile.key);
            formData.append('type', uploadedFile.type);

            uploadFile(formData, {
                onSuccess: (res) => {
                    handleSubmitPolicy(res.data[0]);
                },
                onError: () => {
                    setLoading(false);
                }
            })
        }
    }

    const handleChangeTab = (value: string) => {
        setCurrentTab(value)
    }

    const handleDrop = (files: File[]) => {
        setFiles(files);
    };

    return <Tabs defaultValue="strategy" onValueChange={handleChangeTab} value={currentTab}>
        <TabsList className={'w-full'}>
            <TabsTrigger value="strategy" className={'data-[state=active]:bg-blue-200'}>Chiến lược SKĐ Quốc
                gia</TabsTrigger>
            <TabsTrigger value="plan" className={'data-[state=active]:bg-green-200'}>Kế hoạch hành động
                SKĐ</TabsTrigger>
            <TabsTrigger value="document" className={'data-[state=active]:bg-yellow-200'}>Các văn bản chính
                sách liên quan</TabsTrigger>
        </TabsList>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
            <>
                {tabs.map(tab => (
                    <TabsContent value={tab} className={'mt-2'} key={tab}>
                        {
                            tab !== 'document' ? (loading ? <Loader2 className={'animate-spin'}/> :
                                    <>
                                        {pptLink ?
                                            <div className={'my-6 font-medium'}>
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
                                            className={'h-[calc(100vh-500px)]'}
                                        >
                                            <DropzoneEmptyState/>
                                            <DropzoneContent/>
                                        </Dropzone>
                                    </>
                            ) : <></>
                        }
                    </TabsContent>
                ))}
            </>
        }
    </Tabs>
}
