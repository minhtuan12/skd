import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import {generateJSON} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import {Dot} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {IPolicyDocument} from "@/models/policy-document";

export default function DocumentForm(
    {
        handleChangeFile,
        data,
        imageUrl,
        handleChangeData,
        handleImageChange,
        handleChangeCheck,
    }: {
        handleChangeFile: any,
        data: IPolicyDocument,
        handleChangeData: any,
        imageUrl: string,
        handleImageChange?: any,
        handleChangeCheck: any,
    }) {
    const {
        title,
        text,
        slide,
        pdf,
        link,
        image_url,
    } = data;

    return <div className={'flex gap-8 h-full pb-10'}>
        <div className="space-y-5 w-1/3">
            <div className={'space-y-4'}>
                <div className="grid gap-2">
                    <Label required htmlFor="name">Tên chính sách</Label>
                    <Textarea
                        id="name" placeholder="Nhập tên chính sách" value={title}
                        onChange={e => handleChangeData(e.target.value, 'title')}
                    />
                </div>
                <div className="grid gap-2 mt-1">
                    <Label>Hình ảnh</Label>
                    <UploadFile
                        inputValue={''}
                        url={(imageUrl && imageUrl !== '/') ? imageUrl : image_url as string}
                        handleChangeFile={handleImageChange}
                    />
                </div>
                <Separator/>
                <table className="border-collapse border border-black w-full text-center">
                    <tbody>
                    <tr>
                        <td className={`border border-black p-2 w-1/4 ${link ? 'bg-gray-200' : ''}`}>Slide</td>
                        <td className={`border border-black p-2 ${link ? 'bg-gray-200' : ''}`}>
                            <div className="flex flex-col">
                                <div className={'flex items-center justify-between'}>
                                    {(slide?.url && typeof slide?.url === 'string') ?
                                        <div className={'font-medium text-center text-gray-600'}>
                                            Slide hiện tại:
                                            <a href={slide.url} className={'italic underline text-blue-500 ml-1'}
                                               target={'_blank'}>
                                                Slide
                                            </a>
                                        </div> :
                                        <div className={'mt-1 mb-2 text-[14px] italic text-gray-500 text-center'}>
                                            Chưa có Slide nào
                                        </div>
                                    }
                                    <div
                                        className={'text-[14px] justify-end gap-2 flex items-center mr-1 text-gray-600'}>
                                        Hiển thị tải xuống
                                        <Checkbox
                                            disabled={!!link}
                                            checked={slide?.downloadable || false}
                                            onCheckedChange={checked => handleChangeCheck(checked, 'slide')}
                                        />
                                    </div>
                                </div>
                                <input
                                    accept={'.pptx'}
                                    disabled={!!link}
                                    onChange={(e) => handleChangeFile(e.target.files?.[0] || null, 'slide')}
                                    type={'file'}
                                    className={'border px-3 rounded-sm border-gray-500 cursor-pointer'}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className={`border border-black p-2 w-1/4 ${link ? 'bg-gray-200' : ''}`}>PDF</td>
                        <td className={`border border-black p-2 ${link ? 'bg-gray-200' : ''}`}>
                            <div className="flex flex-col">
                                <div className={'flex items-center justify-between'}>
                                    {(pdf?.url && typeof pdf?.url === 'string') ?
                                        <div className={'font-medium text-center text-gray-600'}>
                                            Slide hiện tại:
                                            <a href={pdf.url} className={'italic underline text-blue-500 ml-1'}
                                               target={'_blank'}>
                                                PDF
                                            </a>
                                        </div> :
                                        <div className={'mt-1 mb-2 text-[14px] italic text-gray-500 text-center'}>
                                            Chưa có PDF nào
                                        </div>
                                    }
                                    <div
                                        className={'text-[14px] justify-end gap-2 flex items-center mr-1 text-gray-600'}>
                                        Hiển thị tải xuống
                                        <Checkbox
                                            disabled={!!link}
                                            checked={pdf?.downloadable || false}
                                            onCheckedChange={checked => handleChangeCheck(checked, 'pdf')}
                                        />
                                    </div>
                                </div>
                                <input
                                    accept={'.pdf'}
                                    disabled={!!link}
                                    onChange={(e) => handleChangeFile(e.target.files?.[0] || null, 'pdf')}
                                    type={'file'}
                                    className={'border px-3 rounded-sm border-gray-500 cursor-pointer'}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-black p-2 w-1/4">Link chi tiết</td>
                        <td className="border border-black p-2">
                            <Input
                                placeholder={'Nhập link'} value={link || ''}
                                onChange={e => handleChangeData(e.target.value, 'link')}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        </div>
        <div className="h-full flex-1 mt-0.5 flex flex-col gap-5">
            <div className="flex flex-col gap-2 h-full">
                <Label htmlFor="name" className={'gap-0'}><Dot/>Mô tả</Label>
                <SimpleEditor
                    content={generateJSON(text as string, [StarterKit])}
                    handleChange={({editor}: any) => handleChangeData(editor.getHTML(), 'text')}
                    className={link ? 'bg-gray-200' : ''}
                />
            </div>
        </div>
    </div>
}
