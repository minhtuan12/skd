import Image from "next/image";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React from "react";
import {cn} from "@/lib/utils";
import {VideoPlayer} from "@/components/ui/video";

export default function UploadFile({url, className, handleChangeFile, video = false, selectedVideo = null}: {
    url: string | File,
    className?: string,
    handleChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    video?: boolean;
    selectedVideo?: File | null;
}) {
    const hasVideoBefore = video && url && typeof url === 'string';

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
        <div className="grid gap-2">
            <Label required htmlFor="upload-file">Tải lên</Label>
            <Input
                id="upload-file" type="file" accept={video ? 'video/*' : "image/*"}
                onChange={handleChangeFile} className={'cursor-pointer'}
            />
        </div>
    </div>
}
