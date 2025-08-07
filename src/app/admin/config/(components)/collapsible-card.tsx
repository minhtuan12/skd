import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {NEWS_EVENTS_TYPE} from "@/constants/enums";
import {Textarea} from "@/components/ui/textarea";
import {DatePicker} from "@/components/ui/date-picker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {NEWS_EVENTS} from "@/constants/common";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import React, {memo} from "react";
import {IHomeConfig, INewsAndEvents} from "@/models/config";

interface IProps {
    data: INewsAndEvents;
    handleImageChange: (e: any, key: string, index: number) => void;
    setCloneConfig: React.Dispatch<React.SetStateAction<IHomeConfig>>;
    index: number;
    imageUrl: string
}

const CollapsibleCard = memo((
    {data, setCloneConfig, handleImageChange, index, imageUrl}: IProps) => {
    const {
        title,
        description,
        date,
        type,
        image_url,
    } = data;

    const handleChangeData = (value: string | Date | undefined, key: string) => {
        setCloneConfig((prev: IHomeConfig) => ({
            ...prev,
            news_and_events: [
                ...prev.news_and_events.slice(0, index),
                {
                    ...prev.news_and_events[index],
                    [key]: value
                },
                ...prev.news_and_events.slice(index + 1),
            ]
        }))
    }

    return (
        <Accordion type="single" collapsible className="w-[calc(100%-40px)] border rounded-md shadow-sm">
            <AccordionItem value="item-1">
                <AccordionTrigger
                    className="h-[50px] cursor-pointer px-4 flex items-center justify-between text-base font-medium w-full hover:no-underline">
                    <div
                        className={'text-ellipsis w-[calc(100%-100px)] overflow-hidden whitespace-nowrap'}>{title}</div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label required htmlFor="title">Tiêu đề</Label>
                            <Input id="title" placeholder="Nhập tiêu đề" value={title}
                                   onChange={e => handleChangeData(e.target.value, 'title')}/>
                        </div>
                        <div className="grid gap-2">
                            <Label required htmlFor="description">Chi tiết</Label>
                            <Textarea id="description" placeholder="Chi tiết" value={description}
                                      onChange={e => handleChangeData(e.target.value, 'description')}/>
                        </div>
                        <div className={'grid gap-6 grid-cols-2'}>
                            <div className="grid gap-2 w-full">
                                <Label htmlFor="description">Loại</Label>
                                <Select value={type}
                                        onValueChange={(value: string) => handleChangeData(value, 'type')}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn loại"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            Object.keys(NEWS_EVENTS).map(key => (
                                                <SelectItem
                                                    key={key}
                                                    value={NEWS_EVENTS_TYPE[key as keyof typeof NEWS_EVENTS_TYPE].toString()}
                                                >
                                                    {NEWS_EVENTS[key as keyof typeof NEWS_EVENTS]}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date">Ngày đăng</Label>
                                <DatePicker date={new Date(date)} setDate={(date) => {
                                    handleChangeData(date, 'date')
                                }}/>
                            </div>
                        </div>
                        <UploadFile url={imageUrl || image_url as string}
                                    handleChangeFile={e => handleImageChange(e, 'image_url', index)}/>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
})

export default CollapsibleCard;
