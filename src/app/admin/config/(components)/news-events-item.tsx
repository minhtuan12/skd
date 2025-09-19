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
import {Checkbox} from "@/components/ui/checkbox";
import {Dot} from "lucide-react";

interface IProps {
    readonly?: boolean
    data: INewsAndEvents;
    handleImageChange: (e: any, key: string, index: number) => void;
    setCloneNews?: React.Dispatch<React.SetStateAction<INewsAndEvents[]>> | undefined;
    index?: number;
    imageUrl: string;
    setNewNewsEvents?: any,
    fileName: string,
    isForm?: boolean,
    otherPosts?: INewsAndEvents[],
}

const NewsEventsItem = memo((
    {
        data,
        setCloneNews,
        handleImageChange,
        index,
        imageUrl,
        readonly,
        setNewNewsEvents,
        fileName,
        isForm,
        otherPosts,
    }: IProps) => {
    const {
        title,
        description,
        date,
        type,
        image_url,
        related_posts
    } = data;
    const handleChangeData = (value: any, key: string) => {
        if (setNewNewsEvents) {
            setNewNewsEvents((prev: any) => ({
                ...prev,
                [key]: value
            }))
        }
    }

    const handleSelectRelatedPosts = (checked: boolean, itemId: string) => {
        if (setNewNewsEvents) {
            setNewNewsEvents((prev: any) => ({
                ...prev,
                related_posts: !checked ?
                    prev.related_posts.filter((i: string) => i !== itemId) :
                    [...prev.related_posts, itemId]
            }))
        }
    }

    return (
        !isForm ?
            <div className="grid gap-4">
                <div className={'font-bold'}>{title}</div>
                <div dangerouslySetInnerHTML={{__html: description}} className={'prose'}/>
                <div>
                    Ngày đăng: <span>{formatDate(date as any)}</span>
                </div>
                <UploadFile
                    inputValue={fileName}
                    disabled={readonly}
                    url={(imageUrl && imageUrl !== '/') ? imageUrl : image_url as string}
                    handleChangeFile={(e: any) => handleImageChange(e, 'image_url', index as number)}
                />
            </div>
            :
            <div className={'flex gap-4 h-full'}>
                <div className="space-y-8 w-1/3">
                    <div className={'space-y-4'}>
                        <div className="grid gap-2">
                            <Label required htmlFor="title" className={'gap-0'}><Dot/>Tiêu đề</Label>
                            <Textarea
                                id="title" placeholder="Nhập tiêu đề" value={title}
                                onChange={e => handleChangeData(e.target.value, 'title')}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date" className={'gap-0'}><Dot/>Ngày đăng</Label>
                            <DatePicker date={new Date(date)} setDate={(date) => {
                                handleChangeData(date, 'date')
                            }}/>
                        </div>
                    </div>
                    <UploadFile
                        inputValue={fileName}
                        url={(imageUrl && imageUrl !== '/') ? imageUrl : image_url as string}
                        handleChangeFile={(e: any) => handleImageChange(e, 'image_url', index as number)}
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="date" className={'gap-0'}><Dot/> Các tin liên quan</Label>
                        <div className={'overflow-auto max-h-[400px] gap-3 flex flex-col border rounded-md p-3'}>
                            {(otherPosts && otherPosts?.filter((item: INewsAndEvents) => item.type === 'news' && item._id !== data?._id)?.length > 0) ?
                                otherPosts?.filter((item: INewsAndEvents) => item.type === 'news' && item._id !== data?._id)
                                    .map((item: INewsAndEvents) => (
                                        <div className={'flex items-start gap-3'} key={item._id}>
                                            <Checkbox
                                                value={item._id}
                                                checked={related_posts.some(i => (i as string) === item._id)}
                                                onCheckedChange={(checked: boolean) => handleSelectRelatedPosts(checked, item._id as string)}
                                            />
                                            <Label htmlFor={item._id} className={'font-normal'}>{item.title}</Label>
                                        </div>
                                    )) : <i>Chưa có tin mới</i>
                            }
                        </div>
                    </div>
                </div>
                <div className="space-y-2 h-full flex-1 mt-0.5">
                    <Label required htmlFor="description" className={'mb-4 gap-0'}><Dot/>Chi tiết</Label>
                    <SimpleEditor
                        content={generateJSON(description, [StarterKit])}
                        handleChange={({editor}: any) => handleChangeData(editor.getHTML(), 'description')}
                    />
                </div>
            </div>
    )
})

export default NewsEventsItem;
