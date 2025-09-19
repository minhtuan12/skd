import Image from "next/image";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React, {useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {VideoPlayer} from "@/components/ui/video";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Loader2} from "lucide-react";
import {useFetchUploadedFiles} from "@/app/admin/config/(hooks)/use-uploaded-files";

export default function UploadFile(
    {
        url,
        className,
        handleChangeFile,
        video = false,
        selectedVideo = null,
        disabled,
        inputValue
    }: {
        url: string | File,
        className?: string,
        handleChangeFile: any;
        video?: boolean;
        selectedVideo?: File | null;
        disabled?: boolean;
        inputValue: string
    }) {
    const hasVideoBefore = video && url && typeof url === 'string';
    const fileRef = useRef(null);
    const [openDialog, setOpenDialog] = useState(false);
    const {data, loading} = useFetchUploadedFiles(openDialog);

    return <div className={cn("grid gap-4", className)}>
        <div
            className={`relative w-full rounded-md overflow-hidden border border-dashed flex items-center justify-center ${video ? (hasVideoBefore ? 'h-auto' : 'h-48') : 'h-48'}`}>
            {!video ? (url ? (
                <Image
                    src={url as string || "/placeholder.svg"}
                    alt="Image Preview"
                    layout="fill"
                    objectFit="cover"
                />
            ) : (
                <div className={'text-gray-500 italic'}>Chưa có hình ảnh</div>
            )) : (url && typeof url === 'string') ? (
                <VideoPlayer src={url}/>
            ) : (
                selectedVideo ? <div className={'space-y-1'}>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tên: {selectedVideo.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Kích thước: {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Loại: {selectedVideo.type}
                    </p>
                </div> : <div className={'text-gray-500 italic'}>Chưa có video</div>
            )}
        </div>
        {
            !disabled ? <div className="grid gap-2">
                <Label required htmlFor="upload-file">Tải lên</Label>
                <div className={'flex gap-4'}>
                    <Button
                        onClick={() => setOpenDialog(true)}
                        className={'hover:bg-gray-100 bg-white text-black border border-solid w-1/2'}
                    >
                        Chọn file có sẵn
                    </Button>
                    <div className={'w-1/2'}>
                        <Input
                            ref={fileRef}
                            id="upload-file" type="file" accept={video ? 'video/*' : "image/*"}
                            onChange={handleChangeFile} className={'cursor-pointer hidden'}
                        />
                        <Button className={'hover:bg-gray-100 bg-white text-black border border-solid w-full'}
                                onClick={() => (fileRef.current as any)?.click()}>{inputValue ? `Đã chọn: ${inputValue}` : 'Chọn file'}</Button>
                    </div>
                </div>
            </div> : ''
        }
        <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
            <DialogContent className={'max-h-[80vh] !max-w-[50vw]'}>
                <DialogHeader>
                    <DialogTitle>
                        Chọn file có sẵn
                    </DialogTitle>
                </DialogHeader>

                {loading ? <Loader2 className={'animate-spin w-6 h-6'}/> : (openDialog ? (
                    <div className="grid grid-cols-4 gap-5 overflow-y-auto max-h-[65vh] w-full">
                        {data?.data?.resources?.map((item: any) => (
                            <div
                                className={'relative w-full h-28 border border-gray-500 rounded-md cursor-pointer hover:opacity-80'}
                                key={item.public_id}
                                onClick={() => {
                                    handleChangeFile(item.url);
                                    setOpenDialog(false);
                                }}
                            >
                                <Image
                                    src={item.url} alt={item.public_id}
                                    fill className={'object-cover rounded-md'}
                                />
                            </div>
                        ))}
                    </div>
                ) : '')}
            </DialogContent>
        </Dialog>
    </div>
}
