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
import NewsAndEvents from "@/app/admin/config/(components)/news_and_events";
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
            reset: handleResetValue,
            submit: handleSubmit
        })
    }, [])

    useEffect(() => {
        setHeroImage(homeConfig.banner.image_url);
        setIntroductionImage(homeConfig.introduction_image_url);
    }, [homeConfig?.banner.image_url, homeConfig?.introduction_image_url]);

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
                } else if (key === 'introduction_image_url') {
                    setIntroductionImage(reader.result as string);
                } else if (index !== -1) {
                    setNewsImageUrls(prev => [...prev.slice(0, index), reader.result as string, ...prev.slice(index + 1)]);
                }

                // set new state for config
                if (index !== -1) {
                    setCloneConfig((prev: IHomeConfig) => ({
                        ...prev,
                        news_and_events: [
                            ...prev.news_and_events.slice(0, index),
                            {
                                ...prev.news_and_events[index],
                                [key]: file,
                                ...prev.news_and_events.slice(index + 1)
                            }
                        ]
                    }))
                } else {
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
            }
            reader.readAsDataURL(file)
        }
    }

    const handleChangeVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setSelectedVideo(file)
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
        toast.info('Đã hủy các thay đổi');
    }

    const validate = () => {
        const currentConfig = cloneConfigRef.current;
        if (currentConfig.news_and_events.length === 0) {
            return false;
        }
        if (!currentConfig.agricultural_policy || !currentConfig.introduction_image_url || !currentConfig.banner.title || !currentConfig.banner.image_url) {
            return false;
        }
        return true;
    }

    // call api upload files
    const handleUploadFiles = () => {
        setLoading(true);
        const currentConfig = cloneConfigRef.current;
        const formData = new FormData();
        let uploadFiles = [
            {file: currentConfig.banner.image_url, key: "banner.image_url", type: 'image'},
            {file: currentConfig.introduction_image_url, key: "introduction_image_url", type: 'image'},
            {file: currentConfig.knowledge_bank_video_url, key: "knowledge_bank_video_url", type: 'video'},
            ...currentConfig.news_and_events.map((item, index) => ({
                file: item.image_url,
                key: `news.${index}`,
                type: 'image',
            }))
        ]

        uploadFiles = uploadFiles.filter(item => typeof item.file !== 'string')
        if (uploadFiles.length > 0) {
            uploadFiles.forEach(uploadFile => {
                formData.append('file', uploadFile.file);
                formData.append('key', uploadFile.key);
                formData.append('type', uploadFile.type);
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
                        } else if (file.key.includes('news')) {
                            const [_, index] = file.key.split('.');
                            newConfig = {
                                ...newConfig,
                                news_and_events: [
                                    ...newConfig.news_and_events.slice(0, Number(index)),
                                    {
                                        ...newConfig.news_and_events[Number(index)],
                                        image_url: file.url,
                                    },
                                    ...newConfig.news_and_events.slice(Number(index) + 1),
                                ]
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
            introduction_image_url: newConfig.introduction_image_url.trim(),
            knowledge_bank_video_url: newConfig.knowledge_bank_video_url.trim(),
            news_and_events: newConfig.news_and_events.filter((item: INewsAndEvents) => item.title !== '').map((item: INewsAndEvents) => ({
                ...item,
                image_url: (item.image_url as string).trim(),
                title: item.title.trim(),
                description: item.description.trim()
            })),
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
            }
        });
    }

    const handleSubmit = () => {
        if (!validate()) {
            toast.warning('Vui lòng nhập đầy đủ dữ liệu bắt buộc!')
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
                                    <UploadFile handleChangeFile={e => handleHeroImageChange(e, 'banner.image_url')}
                                                url={heroImage}/>
                                </div>
                            </div>
                        </CustomCard>

                        <div className={'grid grid-rows-1 gap-4'}>
                            {/* Introduction */}
                            <CustomCard
                                className={'h-fit'}
                                title={'Phần giới thiệu'}
                                description={'Cập nhật ảnh cho phần giới thiệu SKĐ'}
                            >
                                <UploadFile url={introductionImage}
                                            handleChangeFile={e => handleHeroImageChange(e, 'introduction_image_url')}/>
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
                        <NewsAndEvents newsAndEvents={cloneConfig.news_and_events} setCloneConfig={setCloneConfig}
                                       handleChangeImage={handleHeroImageChange} imageUrls={newsImageUrls}/>

                        {/* Knowledge bank video */}
                        <CustomCard
                            className={'h-fit'}
                            title={'Ngân hàng kiến thức'}
                            description={'Cập nhật video cho ngân hàng kiến thức'}
                        >
                            <UploadFile url={cloneConfig?.knowledge_bank_video_url as string}
                                        handleChangeFile={handleChangeVideo}
                                        selectedVideo={selectedVideo} video/>
                        </CustomCard>
                    </div>
                </div>
        }
    </>
}
