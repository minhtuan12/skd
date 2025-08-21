'use client'

import "@cyntler/react-doc-viewer/dist/index.css";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useRef, useState} from "react";
import {Button} from "@/components/ui/button";

interface PowerpointViewerProps {
    slides: string[];
    pptUrl: string;
}

export default function PowerpointViewer({slides, pptUrl}: PowerpointViewerProps) {
    const [current, setCurrent] = useState(0);
    const thumbnailsRef = useRef<HTMLDivElement>(null);

    const scrollThumbnails = (direction: "left" | "right") => {
        if (thumbnailsRef.current) {
            const container = thumbnailsRef.current;
            const scrollAmount = 400;
            container.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full max-w-5xl">
                <div
                    className="h-[60vh] bg-white rounded-xl shadow overflow-hidden border border-solid border-gray-200">
                    <img
                        src={slides[current]}
                        alt={`Slide ${current + 1}`}
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="relative flex items-center mt-4">
                    <Button
                        onClick={() => scrollThumbnails("left")}
                        className="absolute -left-5 z-10 bg-white !p-2 rounded-full shadow hover:bg-gray-100"
                    >
                        <ChevronLeft className="!w-6 !h-6 text-[black]"/>
                    </Button>

                    <div
                        ref={thumbnailsRef}
                        className={`flex gap-2 overflow-x-auto scroll-smooth px-0 w-full ${slides.length >= 8 ? 'justify-start' : 'justify-center'}`}
                    >
                        {slides.map((thumb, index) => (
                            <img
                                key={index}
                                src={thumb}
                                alt={`Slide ${index + 1}`}
                                className={`w-32 h-20 object-cover rounded-md cursor-pointer border-2 transition ${
                                    current === index
                                        ? "border-blue-500 shadow-md"
                                        : "border-transparent"
                                }`}
                                onClick={() => setCurrent(index)}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={() => scrollThumbnails("right")}
                        className="absolute -right-5 z-10 bg-white !p-2 rounded-full shadow hover:bg-gray-100"
                    >
                        <ChevronRight className="!w-6 !h-6 text-[black]"/>
                    </Button>
                </div>
            </div>
            <div className="w-full max-w-5xl flex justify-start cursor-pointer">
                <a className={'underline flex justify-start mt-2 text-lg'} href={pptUrl}>
                    Tải xuống dự thảo
                </a>
            </div>
        </div>
    );
}
