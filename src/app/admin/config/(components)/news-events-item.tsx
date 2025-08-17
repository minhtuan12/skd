import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea";
import {DatePicker} from "@/components/ui/date-picker";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import React, {memo} from "react";
import {INewsAndEvents} from "@/models/config";

interface IProps {
    readonly?: boolean
    data: INewsAndEvents;
    handleImageChange: (e: any, key: string, index: number) => void;
    setCloneNews?: React.Dispatch<React.SetStateAction<INewsAndEvents[]>> | undefined;
    index?: number;
    imageUrl: string;
    setNewNewsEvents?: any,
    fileName: string
}

const NewsEventsItem = memo((
    {data, setCloneNews, handleImageChange, index, imageUrl, readonly, setNewNewsEvents, fileName}: IProps) => {
    const {
        title,
        description,
        date,
        type,
        image_url,
    } = data;
    const handleChangeData = (value: string | Date | undefined, key: string) => {
        if (setNewNewsEvents) {
            setNewNewsEvents((prev: any) => ({
                ...prev,
                [key]: value
            }))
        }
    }

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label required htmlFor="title">Tiêu đề</Label>
                <Input
                    disabled={readonly}
                    id="title" placeholder="Nhập tiêu đề" value={title}
                    onChange={e => handleChangeData(e.target.value, 'title')}
                />
            </div>
            <div className="grid gap-2">
                <Label required htmlFor="description">Chi tiết</Label>
                <Textarea disabled={readonly} id="description" placeholder="Chi tiết" value={description}
                          onChange={e => handleChangeData(e.target.value, 'description')}/>
            </div>
            <div className={`grid gap-6 grid-cols-1`}>
                <div className="grid gap-2">
                    <Label htmlFor="date">Ngày đăng</Label>
                    <DatePicker disabled={readonly} date={new Date(date)} setDate={(date) => {
                        handleChangeData(date, 'date')
                    }}/>
                </div>
            </div>
            <UploadFile
                inputValue={fileName}
                disabled={readonly}
                url={(imageUrl && imageUrl !== '/') ? imageUrl : image_url as string}
                handleChangeFile={e => handleImageChange(e, 'image_url', index as number)}
            />
        </div>
    )
})

export default NewsEventsItem;
