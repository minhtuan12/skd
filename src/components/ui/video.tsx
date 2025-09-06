'use client'

import {cn, isDirectVideoLink} from "@/lib/utils";

function VideoPlayer({className, src}: { className?: string, src: string }) {
    const videoId = !isDirectVideoLink(src) ? src.split("v=")[1].split("&")[0] : src;
    return (
        <div className={cn("w-full mx-auto h-full", className)}>
            {
                isDirectVideoLink(src) ? <video
                    controls
                    width="100%"
                    height="100%"
                    className="rounded"
                >
                    <source src={src} type="video/mp4"/>
                    Trình duyệt của bạn không hỗ trợ video.
                </video> : <div className="w-full aspect-video">
                    <iframe
                        className="w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            }
        </div>
    );
}

export {VideoPlayer}
