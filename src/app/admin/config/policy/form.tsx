import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import {generateJSON} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import React, {useMemo} from "react";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import {Dot, Loader2, Trash} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {IPost} from "@/models/post";
import {useFetchPostList} from "@/app/admin/config/policy/(hooks)/use-post-admin";
import {Image} from "@tiptap/extension-image"

export default function Form(
    {
        handleChangeFile,
        post,
        imageUrl,
        handleChangeData,
        handleImageChange,
        handleChangeCheck,
        handleSelectRelatedPosts,
        handleAddDownload,
        handleDeleteDownload,
        handleChangeDownloads,
        handleChangeFilee,
        isOnePost
    }: {
        handleChangeFile: any,
        post: IPost,
        handleChangeData: any,
        imageUrl: string,
        handleImageChange?: any,
        handleChangeCheck: any,
        handleSelectRelatedPosts: any
        handleAddDownload: any
        handleDeleteDownload: any
        handleChangeDownloads: any
        handleChangeFilee: any
        isOnePost: boolean
    }) {
    return <div className={'flex gap-8 h-full pb-10'}>
        <div className="space-y-5 w-1/3">
            <div className={'space-y-4'}>
                {
                    !isOnePost ? <>
                        <div className="grid gap-2">
                            <Label required htmlFor="name">Tên</Label>
                            <Textarea
                                id="name" placeholder="Nhập tên" value={post.title}
                                onChange={e => handleChangeData(e.target.value, 'title')}
                            />
                        </div>
                        <div className="grid gap-2 mt-1">
                            <Label>Hình ảnh</Label>
                            <UploadFile
                                inputValue={''}
                                url={(imageUrl && imageUrl !== '/') ? imageUrl : post.image_url as string}
                                handleChangeFile={(e: any) => handleImageChange(e, 'image_url')}
                            />
                        </div>
                        <Separator/>
                    </> : ''
                }
                <table className={`${isOnePost ? 'mt-9' : ''} border-collapse border border-black w-full text-center`}>
                    <tbody>
                    <tr>
                        <td className={`border border-black p-2 w-1/4 ${post.link ? 'bg-gray-200' : ''}`}>Slide</td>
                        <td className={`border border-black p-2 ${post.link ? 'bg-gray-200' : ''}`}>
                            <div className="flex flex-col">
                                <div className={'flex items-center justify-between'}>
                                    {(post.slide?.url && typeof post.slide?.url === 'string') ?
                                        <div className={'font-medium text-center text-gray-600'}>
                                            Slide hiện tại:
                                            <a href={post.slide.url}
                                               className={'italic underline text-blue-500 ml-1'}
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
                                            disabled={!!post.link}
                                            checked={post.slide?.downloadable || false}
                                            onCheckedChange={checked => handleChangeCheck(checked as any, 'slide')}
                                        />
                                    </div>
                                </div>
                                <div className={'flex items-end justify-between w-full'}>
                                    <input
                                        accept={'.pptx'}
                                        disabled={!!post.link}
                                        onChange={(e) => handleChangeFile((e.target.files?.[0] || null) as any, 'slide')}
                                        type={'file'}
                                        className={'border px-3 rounded-sm border-gray-500 cursor-pointer'}
                                    />
                                    <div className={'text-red-400 cursor-pointer'}
                                         onClick={() => handleChangeFile('', 'slide')}>Xóa
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className={`border border-black p-2 w-1/4 ${post.link ? 'bg-gray-200' : ''}`}>PDF</td>
                        <td className={`border border-black p-2 ${post.link ? 'bg-gray-200' : ''}`}>
                            <div className="flex flex-col">
                                <div className={'flex items-center justify-between'}>
                                    {(post.pdf?.url && typeof post.pdf?.url === 'string') ?
                                        <div className={'font-medium text-center text-gray-600'}>
                                            Slide hiện tại:
                                            <a href={post.pdf.url} className={'italic underline text-blue-500 ml-1'}
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
                                            disabled={!!post.link}
                                            checked={post.pdf?.downloadable || false}
                                            onCheckedChange={checked => handleChangeCheck(checked as any, 'pdf')}
                                        />
                                    </div>
                                </div>
                                <div className={'flex items-end justify-between w-full'}>
                                    <input
                                        accept={'.pdf'}
                                        disabled={!!post.link}
                                        onChange={(e) => handleChangeFile((e.target.files?.[0] || null) as any, 'pdf')}
                                        type={'file'}
                                        className={'border px-3 rounded-sm border-gray-500 cursor-pointer'}
                                    />
                                    <div className={'text-red-400 cursor-pointer'}
                                         onClick={() => handleChangeFile('', 'pdf')}>Xóa
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-black p-2 w-1/4">Link video</td>
                        <td className="border border-black p-2">
                            <Input
                                placeholder={'Nhập link video'} value={post.video_url || ''}
                                onChange={e => handleChangeData(e.target.value, 'video_url')}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-black p-2 w-1/4">Link chi tiết</td>
                        <td className="border border-black p-2">
                            <Input
                                placeholder={'Nhập link'} value={post.link || ''}
                                onChange={e => handleChangeData(e.target.value, 'link')}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div
                className={'w-full flex flex-col gap-4 shadow-sm rounded-md box-border px-5 py-4 border border-gray-200'}>
                <Label className={'flex justify-between w-full text-base'}>
                    <p className={'text-base'}>Quản lý tải xuống</p>
                    <div
                        className={'text-blue-500 cursor-pointer mr-3'}
                        onClick={handleAddDownload}
                    >
                        + Thêm mới
                    </div>
                </Label>
                <div className={'flex flex-col gap-5'}>
                    {
                        post?.downloads?.map((item: any, index: number) => {
                            const hasDownloadLink = typeof item.file_url === 'string' && item.file_url;
                            return <div className={'flex flex-col gap-1'} key={index}>
                                <p className={'font-medium'}>• Download {index + 1}</p>
                                <div className={'flex items-center justify-between gap-4 mr-3'}>
                                    <div className={'flex items-center gap-4'}>
                                        <Input
                                            className={`${hasDownloadLink ? 'w-1/3' : 'w-1/2'}`}
                                            id="name" placeholder="Nhập tên tài liệu" value={item.name}
                                            onChange={e => handleChangeDownloads(e.target.value, 'name', index)}
                                        />
                                        <input
                                            onChange={(e) => handleChangeFilee((e.target.files?.[0] || null) as any, index)}
                                            type={'file'}
                                            className={`border px-3 rounded-sm h-9 border-gray-500 cursor-pointer ${hasDownloadLink ? 'w-1/3' : 'w-1/2'}`}
                                        />
                                        {
                                            hasDownloadLink ?
                                                <a href={item.file_url} className={'underline text-blue-400'}>File
                                                    hiện tại</a> : ''
                                        }
                                    </div>
                                    <Trash className={'text-red-400 w-6 h-6 cursor-pointer'}
                                           onClick={() => handleDeleteDownload(index)}
                                    />
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
        <div className="h-full flex-1 mt-0.5 flex flex-col gap-5">
            <div className="flex flex-col gap-2 h-full">
                <Label htmlFor="name" className={'gap-0'}><Dot/>Nội dung</Label>
                <SimpleEditor
                    content={generateJSON(post.text as string, [StarterKit, Image])}
                    handleChange={({editor}: any) => handleChangeData(editor.getHTML(), 'text')}
                    className={post.link ? 'bg-gray-200' : ''}
                />
            </div>
        </div>
    </div>
}
