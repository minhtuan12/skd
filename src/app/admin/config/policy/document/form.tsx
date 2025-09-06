import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import {generateJSON} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import {IPolicyDocument} from "@/models/policy-document";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";

export default function DocumentForm({data, handleChangeData, imageUrl, handleImageChange}: {
    data: IPolicyDocument
    handleChangeData: any,
    imageUrl: string,
    handleImageChange?: any,
}) {
    const {
        title,
        description,
        image_url,
    } = data;

    return <div className={'flex gap-4 h-[calc(100vh-200px)] pb-10'}>
        <div className="space-y-5 w-1/3">
            <div className={'space-y-4'}>
                <div className="grid gap-2">
                    <Label required htmlFor="title">Tên chính sách</Label>
                    <Textarea
                        id="title" placeholder="Nhập tên chính sách" value={title}
                        onChange={e => handleChangeData(e.target.value, 'title')}
                    />
                </div>
                <div className="grid gap-2">
                    <Label required htmlFor="image_url">Hình ảnh</Label>
                    <UploadFile
                        inputValue={''}
                        url={(imageUrl && imageUrl !== '/') ? imageUrl : image_url as string}
                        handleChangeFile={handleImageChange}
                    />
                </div>
            </div>
        </div>
        <div className="space-y-2 h-full flex-1 mt-0.5">
            <Label required htmlFor="description" className={'mb-4'}>Nội dung</Label>
            <Select
                onValueChange={type => handleChangeData(type, 'description.type')}
                value={description.description_type}
            >
                <SelectTrigger className="bg-white w-full">
                    <SelectValue placeholder="Chọn nhóm cây"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={'link'}>
                        Link
                    </SelectItem>
                    <SelectItem value={'text'}>
                        Văn bản
                    </SelectItem>
                </SelectContent>
            </Select>
            {description.description_type === 'text' ?
                <SimpleEditor
                    content={generateJSON(description.content as string, [StarterKit])}
                    handleChange={({editor}: any) => handleChangeData(editor.getHTML(), 'description.content')}
                />
                : <Input
                    placeholder={'Nhập đường dẫn'}
                    onChange={e => handleChangeData(e.target.value, 'description.content')}
                    value={description.content}
                />
            }
        </div>
    </div>
}
