'use client'

import React, {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setBreadcrumb, setPageTitle} from "@/redux/slices/admin";
import {routes} from "@/constants/routes";
import {Loader2} from "lucide-react";
import {RootState} from "@/redux/store";
import {INewsAndEvents} from "@/models/config";
import {AdminButtonContext} from "@/contexts/AdminButtonContext";
import {toast} from "sonner";
import {useUploadFile} from "@/app/admin/config/(hooks)/use-upload-file";
import {useNewsEvents} from "@/app/admin/config/(hooks)/use-news-events";
import {useAddNewsEvents} from "@/app/admin/config/(hooks)/use-add-news-events";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import NewsEventsItem from "@/app/admin/config/(components)/news-events-item";
import {NEWS_EVENTS_TYPE} from "@/constants/enums";
import {Button} from "@/components/ui/button";
import {useUpdateNewsEvents} from "@/app/admin/config/(hooks)/use-update-news-events";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import CustomCard from "@/components/custom/custom-card";
import {NEWS_EVENTS} from "@/constants/common";

const defaultItem = {
    date: new Date(),
    description: '',
    title: '',
    type: NEWS_EVENTS_TYPE.NEWS.toString(),
    image_url: ''
}

const tabs = ['news', 'event', 'research'];

export default function NewsConfig() {
    const news = useSelector((state: RootState) => state.config.news);
    const [openModal, setOpenModal] = useState(false);
    const [currentTab, setCurrentTab] = useState('news');
    const dispatch = useDispatch();

    const {setHandlers, setLoading} = useContext(AdminButtonContext);
    const {error, refetch, loading} = useNewsEvents(currentTab);
    const {mutate, loading: loadingAdd, isSuccess, isError, error: errorUpdate} = useAddNewsEvents(currentTab);
    const {mutate: updateNews, loading: loadingUpdate} = useUpdateNewsEvents(currentTab);
    const {uploadFile, loading: loadingUpload} = useUploadFile();

    const [newNewsEvent, setNewNewsEvent] = useState<INewsAndEvents>(defaultItem)
    const [imageUrl, setImageUrl] = useState('');
    const [modalTitle, setModalTitle] = useState(`Thêm mới ${currentTab}`)
    const [files, setFiles] = useState<string[]>([]);

    const activeTabRef = useRef(currentTab);

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: routes.NewsConfig},
            {title: 'Quản lý tin tức, sự kiện và nghiên cứu'}
        ]))
        dispatch(setPageTitle('Quản lý tin tức, sự kiện và nghiên cứu'))
        setHandlers({
            visibleReset: false,
            submitText: 'Thêm mới',
            reset: () => {
            },
            submit: handleAddNews
        })
    }, [])

    useEffect(() => {
        activeTabRef.current = currentTab;
    }, [currentTab]);

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>, key: string, index = -1) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                setFiles((prev: string[]) => {
                    const copy = [...prev];
                    while (copy.length <= index) {
                        copy.push("");
                    }
                    copy[index as any] = file.name;
                    return copy;
                })
                setNewNewsEvent((prev: any) => ({
                    ...prev,
                    image_url: file
                }))
                setImageUrl(reader.result as string);
            }
            reader.readAsDataURL(file)
        }
    }

    // call api add news
    const handleSubmitNewsEvents = (newsEvents: any) => {
        const updatedNews = {
            ...newsEvents,
            image_url: (newsEvents.image_url as string).trim(),
            title: newsEvents.title.trim(),
            description: newsEvents.description.trim()
        }
        if (modalTitle.includes('Thêm')) {
            mutate(updatedNews, {
                onSuccess: () => {
                    toast.success('Thêm mới thành công');
                },
                onSettled: () => {
                    setLoading(false);
                    setOpenModal(false);
                }
            });
        } else if (modalTitle.includes('Cập nhật')) {
            const {is_deleted, ...newData} = updatedNews;
            updateNews(newData, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                },
                onSettled: () => {
                    setLoading(false);
                    setOpenModal(false);
                }
            });
        }
    }

    // call api upload files
    const handleUploadFiles = () => {
        setLoading(true);
        const formData = new FormData();
        let uploadedFile = {
            file: newNewsEvent.image_url,
            key: `news.0`,
            type: 'image',
        }

        if (typeof newNewsEvent.image_url !== 'string') {
            formData.append('file', uploadedFile.file);
            formData.append('key', uploadedFile.key);
            formData.append('type', uploadedFile.type);

            uploadFile(formData, {
                onSuccess: (res) => {
                    let clone = newNewsEvent;
                    clone = {
                        ...clone,
                        image_url: res.data[0].url
                    }
                    handleSubmitNewsEvents(clone);
                },
            })
        } else {
            handleSubmitNewsEvents(newNewsEvent);
        }
    }

    const handleAddNews = () => {
        setModalTitle(`Thêm mới ${NEWS_EVENTS[activeTabRef.current as keyof typeof NEWS_EVENTS]}`)
        setNewNewsEvent(defaultItem)
        setImageUrl('')
        setOpenModal(true);
    }

    const handleSubmit = () => {
        handleUploadFiles();
    }

    const handleChangeTab = (value: string) => {
        setCurrentTab(value)
    }

    const handleChangeNewsVisibility = () => {
        if (newNewsEvent._id) {
            updateNews({
                _id: newNewsEvent._id,
                is_deleted: !newNewsEvent.is_deleted
            }, {
                onSuccess: () => {
                    toast.success('Cập nhật thành công');
                },
                onSettled: () => {
                    setLoading(false);
                    setOpenModal(false);
                }
            });
        }
    }

    return <>
        <Tabs defaultValue="news" onValueChange={handleChangeTab} value={currentTab}>
            <TabsList className={'w-full'}>
                <TabsTrigger value="news" className={'data-[state=active]:bg-blue-200'}>Tin tức</TabsTrigger>
                <TabsTrigger value="event" className={'data-[state=active]:bg-green-200'}>Sự
                    kiện</TabsTrigger>
                <TabsTrigger value="research" className={'data-[state=active]:bg-yellow-200'}>Nghiên cứu</TabsTrigger>
            </TabsList>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                <>
                    {tabs.map(tab => (
                        <TabsContent value={tab} className={'mt-2'} key={tab}>
                            {
                                loading ? <Loader2 className={'animate-spin'}/> :
                                    <div className={'grid gap-4 grid-rows-[auto_auto]'}>
                                        <div
                                            className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5'}>
                                            {
                                                news.map((item: INewsAndEvents, index) => (
                                                    <CustomCard
                                                        key={index}
                                                        title={item.title}
                                                        onClick={() => {
                                                            setOpenModal(true)
                                                            setNewNewsEvent(item)
                                                            setModalTitle(`Cập nhật ${NEWS_EVENTS[currentTab as keyof typeof NEWS_EVENTS]}`)
                                                        }}
                                                        headerClassName={'px-5'}
                                                        contentClassName={'px-5'}
                                                        badge={item.is_deleted ? 'Đã ẩn' : ''}
                                                    >
                                                        <NewsEventsItem
                                                            fileName={files[index] || ''}
                                                            readonly={true}
                                                            data={item}
                                                            handleImageChange={handleChangeImage}
                                                            index={index}
                                                            imageUrl={(imageUrl && newNewsEvent._id === item._id) ? imageUrl : item.image_url as string}
                                                        />
                                                    </CustomCard>
                                                ))
                                            }
                                        </div>
                                    </div>
                            }
                        </TabsContent>
                    ))}
                </>
            }
        </Tabs>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{modalTitle}</DialogTitle>
                </DialogHeader>
                <NewsEventsItem
                    fileName={''}
                    readonly={false}
                    data={newNewsEvent}
                    setNewNewsEvents={setNewNewsEvent}
                    imageUrl={imageUrl}
                    handleImageChange={handleChangeImage}
                />
                <div className={'w-full flex justify-between'}>
                    {modalTitle.includes('Cập nhật') ?
                        <Button
                            className={'w-1/3 bg-red-500 hover:bg-red-400'}
                            disabled={loadingAdd || loadingUpload || loadingUpdate}
                            onClick={handleChangeNewsVisibility}
                        >
                            {(loadingAdd || loadingUpload || loadingUpdate) ?
                                <Loader2 className={'animate-spin'}/> : ''}
                            {newNewsEvent.is_deleted ? `Hiện tin` : 'Ẩn tin'}
                        </Button> : ''
                    }
                    <Button className={modalTitle.includes('Cập nhật') ? 'w-1/3' : 'w-full'}
                            disabled={
                                !newNewsEvent.title || !newNewsEvent.description || !newNewsEvent.image_url
                                || loadingAdd || loadingUpload || loadingUpdate
                            }
                            onClick={handleSubmit}
                    >
                        {(loadingAdd || loadingUpload || loadingUpdate) ?
                            <Loader2 className={'animate-spin'}/> : ''} Lưu
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </>
}
