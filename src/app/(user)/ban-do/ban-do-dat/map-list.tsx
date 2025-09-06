"use client"

import {useRef, useState} from "react"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {IMap} from "@/models/map";
import {Button} from "@/components/ui/button";
import CardWithTitle from "@/components/custom/card-with-title";
import Link from "next/link";
import Image from "next/image";
import useMapPagination from "@/app/(user)/ban-do/ban-do-dat/use-pagination";

export default function MapList({maps, setChosenMap}: { maps: IMap[], setChosenMap: any }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0)
    const {totalPages} = useMapPagination(maps);

    const scrollLeft = () => {
        if (containerRef.current) {
            const width = containerRef.current.clientWidth
            containerRef.current.scrollBy({left: -width, behavior: "smooth"})
            setCurrentPage(prev => prev - 1)
        }
    }

    const scrollRight = () => {
        if (containerRef.current) {
            const width = containerRef.current.clientWidth
            containerRef.current.scrollBy({left: width, behavior: "smooth"})
            setCurrentPage(prev => prev + 1)
        }
    }

    return (
        <div className="relative w-full">
            <Button
                disabled={currentPage === 0}
                onClick={scrollLeft}
                className="text-black border border-gray-100 hover:bg-gray-100 absolute -left-5 xl:-left-15 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
            >
                <ChevronLeft/>
            </Button>

            <div
                ref={containerRef}
                className="flex gap-4 overflow-x-auto tailwind-scrollbar-hide scroll-smooth scrollbar-hide pb-1"
                style={{
                    scrollSnapType: "x mandatory",
                }}
            >
                {maps.map((item: IMap, index: number) => (
                    <CardWithTitle
                        onClick={() => {
                            setChosenMap(item.data_url ? {
                                url: item.data_url,
                                type: 'map',
                                source: item.source
                            } : {
                                url: item.image_url,
                                type: 'image',
                                source: item.source
                            })
                        }}
                        key={index} title={item.name}
                        bgTitleColor={index % 2 == 0 ? 'bg-blue-500' : 'bg-orange-500'}
                        className={'cursor-pointer flex-shrink-0 w-full md:w-[calc((100%-32px)/3)] xl:w-[calc((100%-64px)/5)] [scroll-snap-align:start]'}
                        titleHeight={'line-clamp-1 truncate pt-3'}
                    >
                        <div className={'flex flex-col gap-3 h-full'}>
                            <h5 className={'text-black font-semibold text-[15px]'}>Bản đồ</h5>
                            <div className={'flex-1'}>
                                <Image
                                    src={item.image_url as string} alt={item.name}
                                    width={0}
                                    height={0}
                                    sizes={'100vw'}
                                    style={{width: '100%', height: '100%'}}
                                    className={'object-cover'}
                                />
                            </div>
                        </div>
                        <Link href="#"
                              className="mt-4 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">Xem
                            bản
                            đồ <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                    </CardWithTitle>
                ))}
            </div>

            <Button
                disabled={currentPage === totalPages - 1}
                onClick={scrollRight}
                className="text-black border border-gray-100 hover:bg-gray-100 absolute -right-5 xl:-right-15 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
            >
                <ChevronRight/>
            </Button>

            <div className="flex justify-center mt-10 gap-2">
                {Array.from({length: totalPages}).map((_, index) => (
                    <span
                        key={index}
                        className={`w-3 h-3 rounded-full ${currentPage === index ? "bg-blue-600" : "bg-gray-300"}`}
                    />
                ))}
            </div>
        </div>
    )
}
