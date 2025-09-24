import Image from "next/image";
import {buildDetailPath, cn} from "@/lib/utils";
import Link from "next/link";
import {IPost} from "@/models/post";
import {ISection} from "@/models/section";

export default function (
    {
        item,
        className = '',
        imageClassname = '',
        imageHeight,
        section
    }:
    {
        item: IPost,
        className?: string,
        imageClassname?: string,
        imageHeight?: number,
        section: ISection
    }
) {
    const detailPath = buildDetailPath(item.title, item._id as string);

    return <Link
        href={item.link || `/danh-sach/chi-tiet/${detailPath}`}
        className={cn(className, 'flex flex-col gap-2.5')}
    >
        <div
            className={cn(imageClassname, `rounded-md ${section.header_key === 'knowledge' ? '2xl:h-[265px] xl:h-[200px] md:h-[150px]' : '2xl:h-[180px] xl:h-[200px] md:h-[150px]'} border border-gray-300`)}>
            <Image
                src={item.image_url as string || '/logos/principles.png'}
                alt={item.title}
                width={0}
                height={0}
                style={{width: '100%', height: '100%'}}
                sizes="100vw"
                className={'rounded-md object-cover'}
            />
        </div>
        <div className={'flex flex-col gap-0.5 flex-1 box-border pl-1'}>
            <p className={'font-medium text-gray-500 text-base'}>
                {section.header_key === 'policy' ? 'CHÍNH SÁCH' : 'NGÂN HÀNG KIẾN THỨC'}
            </p>
            <h1 className={'text-[18px] font-medium text-green-700 line-clamp-4'}>{item.title}</h1>
            {/*{*/}
            {/*    item.text ? <div*/}
            {/*        className={'text-gray-500 text-sm line-clamp-2 prose'}*/}
            {/*        dangerouslySetInnerHTML={{__html: item.text as string}}*/}
            {/*    /> : ''*/}
            {/*}*/}
        </div>
    </Link>
}
