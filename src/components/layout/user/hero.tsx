"use client"

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";

export default function Hero({data}: { data: { title: string, description: string, image_url: string }[] }) {
    const [index, setIndex] = useState(0);
    const banners = Object.values(data);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => {
                if (prev + 1 < banners.length) {
                    return prev + 1;
                } else {
                    if (ref.current) {
                        ref.current.scrollTo({left: 0, behavior: "auto"});
                    }
                    return 0;
                }
            });
        }, 5000);

        return () => clearInterval(timer);
    }, [banners.length]);

    useEffect(() => {
        if (!ref.current) return;
        const width = ref.current.clientWidth;

        if (index !== 0) {
            ref.current.scrollTo({
                left: index * width,
                behavior: "smooth",
            });
        }
    }, [index]);

    return (
        <div className={cn("relative w-full")}>
            {/* Track */}
            <div
                ref={ref}
                className="flex text-green-500 scroll-smooth w-full overflow-x-auto scrollbar-hide"
                style={{
                    scrollSnapType: "x mandatory",
                }}
            >
                {banners.map((item, i) => (
                    <div
                        key={i}
                        className="relative w-full py-40 flex-shrink-0 flex items-center justify-center [scroll-snap-align:start]"
                    >
                        <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />

                        {/* Overlay text */}
                        <div className="relative z-20 text-center px-4 md:px-0 text-white">
                            <h2 className="text-5xl font-bold drop-shadow-lg">{item.title}</h2>
                            <p className="mt-4 text-lg drop-shadow">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={cn(
                            "w-3 h-3 rounded-full transition",
                            i === index ? "bg-white" : "bg-gray-400/60"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
