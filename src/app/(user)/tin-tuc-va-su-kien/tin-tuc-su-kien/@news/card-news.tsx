import {INewsAndEvents} from "@/models/config";
import Image from "next/image";
import {buildDetailPath, cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import Link from "next/link";

export default function CardNews(
    {
        news,
        className = '',
        imageClassname = '',
        hideImage = false,
        hideDetailBtn = false,
        imageHeight,
    }:
    {
        news: INewsAndEvents,
        className?: string,
        imageClassname?: string,
        hideImage?: boolean,
        hideDetailBtn?: boolean,
        imageHeight?: number,
    }
) {
    const tag = {
        news: 'TIN TỨC',
        event: 'SỰ KIỆN',
        research: 'NGHIÊN CỨU'
    }
    const detailPath = buildDetailPath(news.title, news._id as string);

    return <div
        className={cn(className, 'flex flex-col gap-4')}
    >
        {
            !hideImage ? <div className={cn(imageClassname, `rounded-md`)}>
                {imageHeight ?
                    <Image
                        src={news.image_url as string}
                        alt={news.title}
                        width={0}
                        height={0}
                        style={{width: '100%', height: imageHeight}}
                        sizes="100vw"
                        className={'rounded-md object-cover'}
                    /> :
                    <Image
                        src={news.image_url as string}
                        alt={news.title}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{width: "100%", height: "auto"}}
                        className={'rounded-md'}
                    />
                }
            </div> : ''
        }
        <div className={'flex flex-col gap-0.5 flex-1'}>
            <p className={'font-medium text-gray-500'}>{tag[news.type as keyof typeof tag]}</p>
            <Link
                href={`/tin-tuc-va-su-kien/chi-tiet/${detailPath}`}
                className={'text-lg font-medium text-green-700 line-clamp-4'}
            >
                {news.title}
            </Link>
            <div className={'text-gray-500 text-md line-clamp-2 prose'}
                 dangerouslySetInnerHTML={{__html: news.description}}/>
        </div>
        {!hideDetailBtn ?
            <div className={'flex justify-end max-sm:w-full'}>
                <Link href={`/tin-tuc-va-su-kien/chi-tiet/${detailPath}`}>
                    <Button
                        className={'max-sm:w-full flex bg-white border-black border text-black justify-center h-8 hover:bg-white hover:text-green-700 hover:border-green-700'}>
                        Xem chi tiết<ChevronRight className={'max-sm:hidden flex'}/>
                    </Button>
                </Link>
            </div> : ''
        }
    </div>
}
