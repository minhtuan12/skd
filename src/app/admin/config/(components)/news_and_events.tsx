import React, {memo} from "react";
import CollapsibleCard from "@/app/admin/config/(components)/collapsible-card";
import {Button} from "@/components/ui/button";
import CustomCard from "@/components/custom/custom-card";
import {IHomeConfig, INewsAndEvents} from "@/models/config";
import {Trash} from "lucide-react";
import {NEWS_EVENTS_TYPE} from "@/constants/enums";
import {dateOptions} from "@/constants/common";

interface IProps {
    newsAndEvents: INewsAndEvents[];
    setCloneConfig: React.Dispatch<React.SetStateAction<IHomeConfig>>;
    handleChangeImage: any;
    imageUrls: string[]
}

const defaultItem: INewsAndEvents = {
    date: new Date().toLocaleDateString('vi-VN', dateOptions as any),
    description: '',
    title: '',
    type: NEWS_EVENTS_TYPE.NEWS.toString(),
    image_url: ''
}

const NewsAndEvents = memo(
    ({newsAndEvents, setCloneConfig, handleChangeImage, imageUrls}: IProps
    ) => {
        const handleAddNews = () => {
            setCloneConfig((prev: IHomeConfig) => ({
                ...prev,
                news_and_events: [
                    ...prev.news_and_events,
                    defaultItem
                ]
            }))
        }

        const handleDeleteNews = (index: number) => {
            setCloneConfig((prev: IHomeConfig) => ({
                ...prev,
                news_and_events: [
                    ...prev.news_and_events.slice(0, index),
                    ...prev.news_and_events.slice(index + 1)
                ]
            }))
        }

        return <CustomCard
            title={
                <div className={'w-full flex items-center justify-between'}>
                    <h3>Tin tức và sự kiện</h3>
                    <Button onClick={handleAddNews}>Thêm</Button>
                </div>
            }
            className={'sm:col-span-1'}
        >
            {
                newsAndEvents.length > 0 ? (
                    <div className={'grid gap-3 max-h-[480px] overflow-y-auto'}>
                        {newsAndEvents?.map((item, index) => (
                            <div className={'flex justify-between items-center gap-4 min-w-0 mr-2'} key={index}>
                                <Trash color={'red'} className={'cursor-pointer flex-shrink-0'}
                                       onClick={() => handleDeleteNews(index)}/>
                                <CollapsibleCard data={item} setCloneConfig={setCloneConfig} index={index}
                                                 handleImageChange={handleChangeImage} imageUrl={imageUrls[index]}/>
                            </div>
                        ))}
                    </div>
                ) : <div className={'text-center w-full text-gray-400 italic'}>
                    Không có dữ liệu
                </div>
            }
        </CustomCard>
    })

export default NewsAndEvents;
