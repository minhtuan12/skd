'use client'

import React, {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setBreadcrumb, setPageTitle} from "@/redux/slices/admin";
import {routes} from "@/constants/routes";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Loader2} from "lucide-react";
import {RootState} from "@/redux/store";
import {IHomeConfig, INewsAndEvents} from "@/models/config";
import {useConfig} from "@/app/admin/config/(hooks)/use-config";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import CustomCard from "@/components/custom/custom-card";
import NewsAndEvents from "@/app/admin/config/(components)/news-and-events";
import {AdminButtonContext} from "@/contexts/AdminButtonContext";
import {toast} from "sonner";
import {useSaveConfig} from "@/app/admin/config/(hooks)/use-save-config";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";

export default function HomeConfig() {
    const homeConfig = useSelector((state: RootState) => state.config.home);
    const [cloneConfig, setCloneConfig] = useState<IHomeConfig>(homeConfig);
    const [heroImage, setHeroImage] = useState("");
    const [introductionImage, setIntroductionImage] = useState("");
    const dispatch = useDispatch();
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [newsImageUrls, setNewsImageUrls] = useState<string[]>([]);
    const [fileInputValue, setFileInputValue] = useState<string[]>(['', '', '']);

    const homeConfigRef = useRef(homeConfig);
    const cloneConfigRef = useRef(cloneConfig);

    const {setHandlers, setLoading} = useContext(AdminButtonContext);
    const {error, refetch, loading} = useConfig('home');
    const {mutate, loading: loadingUpdate, isSuccess, isError, error: errorUpdate} = useSaveConfig('home');
    const {uploadFile} = useUploadFile();

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: routes.HomeConfig},
            {title: 'Trang chủ'}
        ]))
        dispatch(setPageTitle('Trang chủ'))
        setHandlers({
            submitText: 'Cập nhật',
            visibleReset: true,
            reset: handleResetValue,
            submit: handleSubmit
        })
    }, [])

    useEffect(() => {
        setHeroImage(homeConfig.banner.image_url);
        setIntroductionImage(homeConfig.introduction.image_url);
    }, [homeConfig?.banner.image_url, homeConfig?.introduction.image_url]);

    useEffect(() => {
        homeConfigRef.current = homeConfig;
        setCloneConfig(homeConfig);
    }, [homeConfig]);

    useEffect(() => {
        cloneConfigRef.current = cloneConfig;
    }, [cloneConfig]);

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, index = -1) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                // set new preview image url
                if (key.includes('banner')) {
                    setHeroImage(reader.result as string);
                    setFileInputValue(prev => [file.name, ...prev.slice(1)]);
                } else if (key.includes('introduction')) {
                    setIntroductionImage(reader.result as string);
                    setFileInputValue(prev => [...prev.slice(0, 1), file.name, ...prev.slice(2)]);
                }

                // set new state for config
                if (key.includes('.')) {
                    const [parent, child] = key.split('.');
                    setCloneConfig(prev => ({
                        ...prev,
                        [parent]: {
                            ...prev[parent as keyof typeof cloneConfig] as any,
                            [child]: file
                        }
                    }))
                } else {
                    setCloneConfig({
                        ...cloneConfig,
                        [key]: file
                    })
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleChangeVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setFileInputValue((prev: any) => [...prev.slice(0, 2), file.name]);
            setCloneConfig((prev: IHomeConfig) => ({
                ...prev,
                knowledge_bank_video_url: file
            }))
        } else {
            setSelectedVideo(null)
        }
    }

    const handleChangeInput = (value: string, key: string) => {
        if (key.includes('.')) {
            const [parent, child] = key.split('.');
            setCloneConfig(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof typeof cloneConfig] as any,
                    [child]: value
                }
            }))
        } else {
            setCloneConfig({
                ...cloneConfig,
                [key]: value
            })
        }
    }

    const handleResetValue = () => {
        setCloneConfig(homeConfigRef.current);
        setHeroImage(homeConfigRef.current.banner.image_url);
        setIntroductionImage(homeConfigRef.current.introduction.image_url);
        setFileInputValue(['', '', '']);
        toast.info('Đã hủy các thay đổi');
    }

    const validate = () => {
        const currentConfig = cloneConfigRef.current;
        if (!currentConfig.agricultural_policy || !currentConfig.introduction.image_url || !currentConfig.introduction.content || !currentConfig.banner.title || !currentConfig.banner.image_url) {
            return false;
        }
        return true;
    }

    // call api upload files
    const handleUploadFiles = () => {
        setLoading(true);
        const currentConfig = cloneConfigRef.current;
        const oldConfig = homeConfigRef.current;
        const formData = new FormData();
        let uploadFiles = [
            {
                file: currentConfig.banner.image_url,
                key: "banner.image_url",
                type: 'image',
                oldUrl: oldConfig.banner.image_url
            },
            {
                file: currentConfig.introduction.image_url,
                key: "introduction.image_url",
                type: 'image',
                oldUrl: oldConfig.introduction.image_url
            },
            {
                file: currentConfig.knowledge_bank_video_url,
                key: "knowledge_bank_video_url",
                type: 'video',
                oldUrl: oldConfig.knowledge_bank_video_url
            },
        ]

        uploadFiles = uploadFiles.filter(item => typeof item.file !== 'string')
        if (uploadFiles.length > 0) {
            uploadFiles.forEach(uploadFile => {
                formData.append('file', uploadFile.file);
                formData.append('key', uploadFile.key);
                formData.append('type', uploadFile.type);
                formData.append('oldUrl', uploadFile.oldUrl);
            })

            uploadFile(formData, {
                onSuccess: (res) => {
                    let newConfig = cloneConfigRef.current;
                    const files = res.data;
                    for (let file of files) {
                        if (file.key.includes('banner')) {
                            const [_, child] = file.key.split('.');
                            newConfig = {
                                ...newConfig,
                                banner: {
                                    ...newConfig.banner,
                                    [child]: file.url
                                }
                            }
                        } else if (file.key.includes('introduction')) {
                            const [_, child] = file.key.split('.');
                            newConfig = {
                                ...newConfig,
                                introduction: {
                                    ...newConfig.introduction,
                                    [child]: file.url
                                }
                            }
                        } else {
                            newConfig = {
                                ...newConfig,
                                [file.key]: file.url
                            }
                        }
                    }
                    handleSubmitUpdateConfig(newConfig);
                },
            })
        } else {
            handleSubmitUpdateConfig(currentConfig);
        }
    }

    // call api update config
    const handleSubmitUpdateConfig = (newConfig: any) => {
        const updatedConfig = {
            introduction: {
                content: newConfig.introduction.content.trim(),
                image_url: newConfig.introduction.image_url.trim()
            },
            news_and_events: newConfig.news_and_events.map((item: INewsAndEvents) => item._id),
            knowledge_bank_video_url: newConfig.knowledge_bank_video_url.trim(),
            agricultural_policy: newConfig.agricultural_policy.trim(),
            banner: {
                title: newConfig.banner.title.trim(),
                description: newConfig.banner.description.trim(),
                image_url: (newConfig.banner.image_url as string).trim()
            }
        }
        mutate(updatedConfig, {
            onSuccess: () => {
                setCloneConfig(updatedConfig);
                toast.success('Cập nhật thành công');
            },
            onSettled: () => {
                setLoading(false);
                setFileInputValue(['', '', ''])
            }
        });
    }

    const handleSubmit = () => {
        if (!validate()) {
            toast.warning('Vui lòng nhập đầy đủ dữ liệu bắt buộc!')
            return;
        }
        const currentConfig = cloneConfigRef.current;
        if (currentConfig.news_and_events.length < 3) {
            toast.warning('Chọn đủ 3 tin tức, sự kiện và nghiên cứu!')
            return;
        }
        handleUploadFiles();
    }

    return <>
        {
            loading ? <Loader2 className={'animate-spin'}/> :
                <div className={'grid gap-4 grid-rows-[auto_auto]'}>
                    <div className={'grid gap-4 grid-cols-1 xl:grid-cols-2 row-span-1'}>
                        {/* Banner */}
                        <CustomCard
                            title={'Banner'}
                            description={'Cập nhật tiêu đề và mô tả'}
                            className={'sm:col-span-1'}
                        >
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label required htmlFor="title">Tiêu đề</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Nhập tiêu đề trang web"
                                        value={cloneConfig?.banner.title}
                                        onChange={(e) => handleChangeInput(e.target.value, 'banner.title')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Nhập mô tả trang web"
                                        value={cloneConfig?.banner.description}
                                        onChange={(e) => handleChangeInput(e.target.value, 'banner.description')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="image" required>Hình ảnh</Label>
                                    <UploadFile
                                        inputValue={fileInputValue[0]}
                                        handleChangeFile={e => handleHeroImageChange(e, 'banner.image_url')}
                                        url={heroImage}
                                    />
                                </div>
                            </div>
                        </CustomCard>

                        <div className={'grid grid-rows-1 gap-4'}>
                            {/* Introduction */}
                            <CustomCard
                                className={'h-fit'}
                                title={'Phần giới thiệu'}
                                description={'Cập nhật nội dung và ảnh cho phần giới thiệu SKĐ'}
                            >
                                <div className={'grid gap-4'}>
                                    <div className={'grid gap-2'}>
                                        <Label required htmlFor="introduction">Giới thiệu</Label>
                                        <Textarea
                                            id="introduction"
                                            placeholder="Giới thieệu về Sức khỏe đất"
                                            value={cloneConfig?.introduction.content || ''}
                                            onChange={(e) => handleChangeInput(e.target.value, 'introduction.content')}
                                        />
                                    </div>
                                    <UploadFile
                                        inputValue={fileInputValue[1]}
                                        url={introductionImage}
                                        handleChangeFile={e => handleHeroImageChange(e, 'introduction.image_url')}/>
                                </div>
                            </CustomCard>

                            {/* Agricultural Policy */}
                            <CustomCard
                                title={'Chính sách Nông Nghiệp'}
                                description={'Cập nhật chính sách'}
                                className={'sm:col-span-1'}
                            >
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label required htmlFor="policy">Chính sách</Label>
                                        <Textarea
                                            id="policy"
                                            placeholder="Nhập chính sách"
                                            value={cloneConfig?.agricultural_policy || ''}
                                            onChange={(e) => handleChangeInput(e.target.value, 'agricultural_policy')}
                                        />
                                    </div>
                                </div>
                            </CustomCard>
                        </div>
                    </div>
                    <div className={'grid gap-4 grid-cols-1 xl:grid-cols-2 h-fit'}>
                        {/* News and events */}
                        <NewsAndEvents
                            readonly
                            newsAndEvents={cloneConfig.news_and_events}
                            handleChangeImage={handleHeroImageChange} imageUrls={newsImageUrls}
                            setCloneConfig={setCloneConfig}
                        />

                        {/* Knowledge bank video */}
                        <CustomCard
                            className={'h-fit'}
                            title={'Ngân hàng kiến thức'}
                            description={'Cập nhật video cho ngân hàng kiến thức'}
                        >
                            <UploadFile
                                inputValue={fileInputValue[2]}
                                url={cloneConfig?.knowledge_bank_video_url as string}
                                handleChangeFile={handleChangeVideo}
                                selectedVideo={selectedVideo} video
                            />
                        </CustomCard>
                    </div>
                </div>
        }
    </>
}
