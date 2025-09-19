'use client'

import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setBreadcrumb} from "@/redux/slices/admin";
import {routes} from "@/constants/routes";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Loader2, Plus, RotateCcw, Trash} from "lucide-react";
import {RootState} from "@/redux/store";
import {IHomeConfig, INewsAndEvents} from "@/models/config";
import {useConfig} from "@/app/admin/config/(hooks)/use-config";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import CustomCard from "@/components/custom/custom-card";
import NewsAndEvents from "@/app/admin/config/(components)/news-and-events";
import {toast} from "sonner";
import {useSaveConfig} from "@/app/admin/config/(hooks)/use-save-config";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {Button} from "@/components/ui/button";
import PolicySelection from "@/app/admin/config/(components)/policy-selection";
import {IPolicyDocument} from "@/models/policy-document";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

export default function HomeConfig() {
    const homeConfig = useSelector((state: RootState) => state.config.home);
    const [cloneConfig, setCloneConfig] = useState<IHomeConfig>(homeConfig);
    const [heroImage, setHeroImage] = useState([""]);
    const [adsImage, setAdsImage] = useState([""]);
    const [introductionImage, setIntroductionImage] = useState("");
    const dispatch = useDispatch();
    const [newsImageUrls, setNewsImageUrls] = useState<string[]>([]);
    const [fileInputValue, setFileInputValue] = useState<string[]>(['', '', '']);

    const homeConfigRef = useRef(homeConfig);
    const cloneConfigRef = useRef(cloneConfig);

    const {error, refetch, loading} = useConfig('home');
    const {mutate, loading: loadingUpdate, isSuccess, isError, error: errorUpdate} = useSaveConfig('home');
    const {uploadFile, loading: loadingUpload} = useUploadFile();

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: routes.HomeConfig},
            {title: 'Trang chủ'}
        ]))
    }, [])

    useEffect(() => {
        setHeroImage(homeConfig.banner?.map(i => i.image_url));
        setIntroductionImage(homeConfig.introduction.image_url);
    }, [homeConfig?.banner?.length, homeConfig?.introduction.image_url]);

    useEffect(() => {
        homeConfigRef.current = homeConfig;
        setCloneConfig(homeConfig);
    }, [homeConfig]);

    useEffect(() => {
        cloneConfigRef.current = cloneConfig;
    }, [cloneConfig]);

    const handleHeroImageChange = (e: any, key: string, index = -1) => {
        if (typeof e !== 'string') {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onloadend = () => {
                    // set new preview image url
                    if ((key.includes('banner') || key.includes('ads')) && index >= 0) {
                        if (key.includes('banner')) {
                            setHeroImage([
                                ...heroImage.slice(0, index),
                                reader.result as string,
                                ...heroImage.slice(index + 1)
                            ]);
                        } else if (key.includes('ads')) {
                            setAdsImage([
                                ...adsImage.slice(0, index),
                                reader.result as string,
                                ...adsImage.slice(index + 1)
                            ]);
                        }
                        setFileInputValue(prev => [file.name, ...prev.slice(1)]);
                    } else if (key.includes('introduction')) {
                        setIntroductionImage(reader.result as string);
                        setFileInputValue(prev => [...prev.slice(0, 1), file.name, ...prev.slice(2)]);
                    }

                    // set new state for config
                    if (key.includes('.')) {
                        if (index >= 0) {
                            const [parent, child] = key.split('.');
                            setCloneConfig(prev => ({
                                ...prev,
                                [parent]: [
                                    ...(prev[parent as keyof typeof prev] as any).slice(0, index),
                                    {
                                        ...(prev[parent as keyof typeof prev] as any)[index],
                                        image_url: file
                                    },
                                    ...(prev[parent as keyof typeof prev] as any).slice(index + 1)
                                ]
                            }))
                        } else {
                            const [parent, child] = key.split('.');
                            setCloneConfig(prev => ({
                                ...prev,
                                [parent]: {
                                    ...prev[parent as keyof typeof cloneConfig] as any,
                                    [child]: file
                                }
                            }))
                        }
                    } else {
                        setCloneConfig({
                            ...cloneConfig,
                            [key]: file
                        })
                    }
                }
                reader.readAsDataURL(file)
            }
        } else {
            if ((key.includes('banner') || key.includes('ads')) && index >= 0) {
                if (key.includes('banner')) {
                    setHeroImage([
                        ...heroImage.slice(0, index),
                        e as string,
                        ...heroImage.slice(index + 1)
                    ]);
                } else if (key.includes('ads')) {
                    setAdsImage([
                        ...adsImage.slice(0, index),
                        e as string,
                        ...adsImage.slice(index + 1)
                    ]);
                }
            } else if (key.includes('introduction')) {
                setIntroductionImage(e as string);
            }

            // set new state for config
            if (key.includes('.')) {
                if (index >= 0) {
                    if (key.includes('banner')) {
                        setCloneConfig(prev => ({
                            ...prev,
                            banner: [
                                ...prev.banner.slice(0, index),
                                {
                                    ...prev.banner[index],
                                    image_url: e
                                },
                                ...prev.banner.slice(index + 1)
                            ]
                        }))
                    } else if (key.includes('ads')) {
                        setCloneConfig(prev => ({
                            ...prev,
                            ads: [
                                ...prev.ads.slice(0, index),
                                {
                                    ...prev.ads[index],
                                    image_url: e
                                },
                                ...prev.ads.slice(index + 1)
                            ]
                        }))
                    }
                } else {
                    const [parent, child] = key.split('.');
                    setCloneConfig(prev => ({
                        ...prev,
                        [parent]: {
                            ...prev[parent as keyof typeof cloneConfig] as any,
                            [child]: e
                        }
                    }))
                }
            } else {
                setCloneConfig({
                    ...cloneConfig,
                    [key]: e
                })
            }
        }
    }

    const handleChangeInput = (value: string, key: string) => {
        if (key.includes('banner') || key.includes('ads')) {
            const [parent, index, field] = key.split('.');
            setCloneConfig(prev => ({
                ...prev,
                [parent]: [
                    ...(prev[parent as keyof typeof prev] as any).slice(0, Number(index)),
                    {
                        ...(prev[parent as keyof typeof prev] as any)[Number(index)],
                        [field]: value
                    },
                    ...(prev[parent as keyof typeof prev] as any).slice(Number(index) + 1)
                ]
            } as any))
        } else if (key.includes('.')) {
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
        setHeroImage(homeConfigRef.current.banner.map(i => i.image_url));
        setAdsImage(homeConfigRef.current.ads.map((i: any) => i.image_url));
        setIntroductionImage(homeConfigRef.current.introduction.image_url);
        setFileInputValue(['', '', '']);
        toast.info('Đã hủy các thay đổi');
    }

    const validate = () => {
        const currentConfig = cloneConfigRef.current;
        if (!currentConfig.introduction.image_url || !currentConfig.introduction.content ||
            currentConfig.banner.some(i => i.image_url === '') ||
            currentConfig.ads.some(i => i.image_url === '' || i.link === '')
        ) {
            return false;
        }
        return true;
    }

    // call api upload files
    const handleUploadFiles = () => {
        const currentConfig = cloneConfigRef.current;
        const formData = new FormData();
        let uploadFiles = [
            ...currentConfig.banner.map((i, index) => ({
                file: i.image_url,
                key: `banner.${index}`,
                type: 'image',
            })),
            ...currentConfig.ads.map((i, index) => ({
                file: i.image_url,
                key: `ads.${index}`,
                type: 'image',
            })),
            {
                file: currentConfig.introduction.image_url,
                key: "introduction.image_url",
                type: 'image',
            }
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
                        if (file.key.includes('banner') || file.key.includes('ads')) {
                            const [parent, index] = file.key.split('.');
                            newConfig = {
                                ...newConfig,
                                [parent]: [
                                    ...(newConfig[parent as keyof typeof newConfig] as any).slice(0, index),
                                    {
                                        ...(newConfig[parent as keyof typeof newConfig] as any)[index],
                                        image_url: file.url
                                    },
                                    ...(newConfig[parent as keyof typeof newConfig] as any).slice(index + 1)
                                ]
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
            agricultural_policy: newConfig.agricultural_policy.map((item: IPolicyDocument) => item._id),
            banner: newConfig.banner.map((item: any) => ({
                title: item.title,
                description: item.description,
                image_url: (item.image_url as string).trim()
            })),
            ads: newConfig.ads.map((i: any) => ({
                image_url: (i.image_url as string).trim(),
                link: i.link.trim()
            }))
        }
        mutate(updatedConfig, {
            onSuccess: () => {
                // setCloneConfig(updatedConfig);
                toast.success('Cập nhật thành công');
            },
            onSettled: () => {
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
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Trang chủ</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                <Button onClick={handleResetValue} disabled={loadingUpdate || loadingUpload}
                        className={'bg-white text-black border-black border hover:bg-gray-100'}>
                    {(loadingUpdate || loadingUpload) &&
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    <RotateCcw/>Đặt lại
                </Button>
                <Button onClick={handleSubmit} disabled={loadingUpdate || loadingUpload}>
                    {(loadingUpdate || loadingUpload) &&
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Cập nhật
                </Button>
            </div>
        </div>
        {
            loading ? <Loader2 className={'animate-spin'}/> :
                <div className={'grid gap-4 grid-rows-[auto_auto]'}>
                    <div className={'grid gap-4 grid-cols-1 xl:grid-cols-2 row-span-1'}>
                        {/* Banner */}
                        <div className={'grid grid-rows-1 gap-4'}>
                            <CustomCard
                                title={'Banner'}
                                description={'Cập nhật tiêu đề và mô tả'}
                                className={'sm:col-span-1'}
                            >
                                <Button className={'w-full mb-4'} onClick={() => {
                                    setCloneConfig({
                                        ...cloneConfig,
                                        banner: [
                                            ...cloneConfig.banner,
                                            {
                                                title: '',
                                                description: '',
                                                image_url: ''
                                            }
                                        ]
                                    })
                                }}><Plus/> Thêm banner</Button>
                                <div className={'overflow-auto max-h-[650px] flex flex-col gap-3'}>
                                    {
                                        cloneConfig.banner.map((item, index) => (
                                            <Accordion type="single" collapsible key={index}
                                                       className="w-full border rounded-md shadow-sm">
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger
                                                        className="h-[50px] cursor-pointer px-4 flex items-center justify-between text-base font-medium w-full hover:no-underline">
                                                        <div
                                                            className={'text-ellipsis w-full overflow-hidden whitespace-nowrap'}>
                                                            Banner {index + 1}
                                                        </div>
                                                        {
                                                            cloneConfig.banner.length > 1 ? <Trash
                                                                className={'text-red-400 !transform-none !rotate-0'}
                                                                onClick={() => {
                                                                    setCloneConfig({
                                                                        ...cloneConfig,
                                                                        banner: [
                                                                            ...cloneConfig.banner.slice(0, index),
                                                                            ...cloneConfig.banner.slice(index + 1)
                                                                        ]
                                                                    })
                                                                }}/> : ''
                                                        }
                                                    </AccordionTrigger>
                                                    <AccordionContent className="p-4 border-t bg-gray-100/80">
                                                        <div className="grid gap-4">
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="title">Tiêu đề thứ {index + 1}</Label>
                                                                <Input
                                                                    className={'bg-white'}
                                                                    id="title"
                                                                    type="text"
                                                                    placeholder="Nhập tiêu đề"
                                                                    value={item.title}
                                                                    onChange={(e) => handleChangeInput(e.target.value, `banner.${index}.title`)}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="description">Mô tả
                                                                    thứ {index + 1}</Label>
                                                                <Textarea
                                                                    className={'bg-white'}
                                                                    id="description"
                                                                    placeholder="Nhập mô tả"
                                                                    value={item.description}
                                                                    onChange={(e) => handleChangeInput(e.target.value, `banner.${index}.description`)}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="image" required>Hình ảnh
                                                                    thứ {index + 1}</Label>
                                                                <UploadFile
                                                                    inputValue={''}
                                                                    handleChangeFile={(e: any) => handleHeroImageChange(e, 'banner.image_url', index)}
                                                                    url={heroImage[index]}
                                                                />
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        ))
                                    }
                                </div>
                            </CustomCard>

                            {/* News and events */}
                            <NewsAndEvents
                                readonly
                                newsAndEvents={cloneConfig.news_and_events}
                                handleChangeImage={handleHeroImageChange} imageUrls={newsImageUrls}
                                setCloneConfig={setCloneConfig}
                            />
                        </div>

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
                                            placeholder="Giới thiệu về Sức khỏe đất"
                                            value={cloneConfig?.introduction.content || ''}
                                            onChange={(e) => handleChangeInput(e.target.value, 'introduction.content')}
                                        />
                                    </div>
                                    <UploadFile
                                        inputValue={fileInputValue[1]}
                                        url={introductionImage}
                                        handleChangeFile={(e: any) => handleHeroImageChange(e, 'introduction.image_url')}/>
                                </div>
                            </CustomCard>

                            {/* Agricultural Policy */}
                            <PolicySelection
                                policy={cloneConfig.agricultural_policy as IPolicyDocument[]}
                                setCloneConfig={setCloneConfig}
                            />
                        </div>
                    </div>
                    <div className={'grid gap-4 grid-cols-1 xl:grid-cols-2 h-fit'}>
                        {/* Ads */}
                        <CustomCard
                            title={'Quảng cáo'}
                            description={'Cập nhật quảng cáo'}
                            className={'sm:col-span-1'}
                        >
                            <Button className={'w-full mb-4'} onClick={() => {
                                setCloneConfig({
                                    ...cloneConfig,
                                    ads: [
                                        ...cloneConfig.ads,
                                        {
                                            link: '',
                                            image_url: ''
                                        }
                                    ]
                                })
                            }}><Plus/> Thêm quảng cáo</Button>
                            <div className={'overflow-auto max-h-[650px] flex flex-col gap-3'}>
                                {
                                    cloneConfig.ads.map((item, index) => (
                                        <Accordion
                                            type="single" collapsible key={index}
                                            className="w-full border rounded-md shadow-sm"
                                        >
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger
                                                    className="h-[50px] cursor-pointer px-4 flex items-center justify-between text-base font-medium w-full hover:no-underline">
                                                    <div
                                                        className={'text-ellipsis w-full overflow-hidden whitespace-nowrap'}>
                                                        Quảng cáo {index + 1}
                                                    </div>
                                                    {
                                                        cloneConfig.ads.length > 1 ?
                                                            <Trash className={'text-red-400 !transform-none !rotate-0'}
                                                                   onClick={() => {
                                                                       setCloneConfig({
                                                                           ...cloneConfig,
                                                                           ads: [
                                                                               ...cloneConfig.ads.slice(0, index),
                                                                               ...cloneConfig.ads.slice(index + 1)
                                                                           ]
                                                                       })
                                                                   }}/> : ''
                                                    }
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 border-t bg-gray-100/80">
                                                    <div className="grid gap-4">
                                                        <div className="grid gap-2">
                                                            <Label required htmlFor="link">Link thứ {index + 1}</Label>
                                                            <Input
                                                                className={'bg-white'}
                                                                id="link"
                                                                type="text"
                                                                placeholder="Nhập link"
                                                                value={item.link}
                                                                onChange={(e) => handleChangeInput(e.target.value, `ads.${index}.link`)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="image" required>Hình ảnh
                                                                thứ {index + 1}</Label>
                                                            <UploadFile
                                                                inputValue={''}
                                                                handleChangeFile={(e: any) => handleHeroImageChange(e, 'ads.image_url', index)}
                                                                url={adsImage[index]}
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ))
                                }
                            </div>
                        </CustomCard>

                        {/* Knowledge bank video */}
                        <CustomCard
                            className={'h-fit'}
                            title={'Ngân hàng kiến thức'}
                            description={'Cập nhật video cho ngân hàng kiến thức'}
                        >
                            <div className="grid gap-2">
                                <Label required htmlFor="knowledge_bank_video_url">Đường dẫn video</Label>
                                <Input
                                    id="knowledge_bank_video_url"
                                    placeholder="Nhập đường dẫn video"
                                    value={cloneConfig?.knowledge_bank_video_url || ''}
                                    onChange={(e) => handleChangeInput(e.target.value, 'knowledge_bank_video_url')}
                                />
                            </div>
                        </CustomCard>
                    </div>
                </div>
        }
    </>
}
