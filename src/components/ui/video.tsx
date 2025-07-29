'use client'

import {cn} from "@/lib/utils";

export default function VideoPlayer({className, src}: { className?: string, src: string }) {
    return (
        <div className={cn("w-full mx-auto h-full", className)}>
            <video
                controls
                width="100%"
                height="100%"
                className="rounded"
            >
                <source src={src} type="video/mp4"/>
                Trình duyệt của bạn không hỗ trợ video.
            </video>
        </div>
    );
}
