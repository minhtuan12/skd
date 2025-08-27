import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea";
import {DatePicker} from "@/components/ui/date-picker";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import React, {memo} from "react";
import {INewsAndEvents} from "@/models/config";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import StarterKit from "@tiptap/starter-kit";
import {generateJSON} from "@tiptap/core";
import {formatDate} from "@/lib/utils";

interface IProps {
    readonly?: boolean
    data: INewsAndEvents;
    handleImageChange: (e: any, key: string, index: number) => void;
    setCloneNews?: React.Dispatch<React.SetStateAction<INewsAndEvents[]>> | undefined;
    index?: number;
    imageUrl: string;
    setNewNewsEvents?: any,
    fileName: string,
    isForm?: boolean
}

const NewsEventsItem = memo((
    {data, setCloneNews, handleImageChange, index, imageUrl, readonly, setNewNewsEvents, fileName, isForm}: IProps) => {
    const {
        title,
        description,
        date,
        type,
        image_url,
    } = data;
    const handleChangeData = (value: any, key: string) => {
        if (setNewNewsEvents) {
            setNewNewsEvents((prev: any) => ({
                ...prev,
                [key]: value
            }))
        }
    }

    return (
        !isForm ?
            <div className="grid gap-4">
                <div className={'font-bold'}>{title}</div>
                <div dangerouslySetInnerHTML={{__html: description}}/>
                <div>
                    Ngày đăng: <span>{formatDate(date as any)}</span>
                </div>
                <UploadFile
                    inputValue={fileName}
                    disabled={readonly}
                    url={(imageUrl && imageUrl !== '/') ? imageUrl : image_url as string}
                    handleChangeFile={e => handleImageChange(e, 'image_url', index as number)}
                />
            </div>
            :
            <div className={'flex gap-4 h-full'}>
                <div className="space-y-5 w-1/3">
                    <div className={'space-y-4'}>
                        <div className="grid gap-2">
                            <Label required htmlFor="title">Tiêu đề</Label>
                            <Textarea
                                id="title" placeholder="Nhập tiêu đề" value={title}
                                onChange={e => handleChangeData(e.target.value, 'title')}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Ngày đăng</Label>
                            <DatePicker date={new Date(date)} setDate={(date) => {
                                handleChangeData(date, 'date')
                            }}/>
                        </div>
                    </div>
                    <UploadFile
                        inputValue={fileName}
                        url={(imageUrl && imageUrl !== '/') ? imageUrl : image_url as string}
                        handleChangeFile={e => handleImageChange(e, 'image_url', index as number)}
                    />
                </div>
                <div className="space-y-2 h-full flex-1 mt-0.5">
                    <Label required htmlFor="description" className={'mb-4'}>Chi tiết</Label>
                    <SimpleEditor
                        content={generateJSON(description, [StarterKit])}
                        handleChange={({editor}: any) => handleChangeData(editor.getHTML(), 'description')}
                    />
                </div>
            </div>
    )
})

export default NewsEventsItem;
