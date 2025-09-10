import Image from "next/image";
import {buildDetailPath, cn} from "@/lib/utils";
import {IPolicyDocument} from "@/models/policy-document";
import Link from "next/link";

export default function PolicyCard(
    {
        item,
        className = '',
        imageClassname = '',
        imageHeight,
    }:
    {
        item: IPolicyDocument,
        className?: string,
        imageClassname?: string,
        imageHeight?: number,
    }
) {
    const detailPath = buildDetailPath(item.title, item._id as string);

    return <Link
        href={item.link || `/thong-tin-chinh-sach/chinh-sach/chi-tiet/${detailPath}`}
        className={cn(className, 'flex flex-col gap-2.5')}
    >
        <div className={cn(imageClassname, `rounded-md 2xl:h-[265px] xl:h-[200px] md:h-[150px] border border-gray-300`)}>
            <Image
                src={item.image_url as string}
                alt={item.title}
                width={0}
                height={0}
                style={{width: '100%', height: 'auto'}}
                sizes="100vw"
                className={'rounded-md object-cover'}
            />
        </div>
        <div className={'flex flex-col gap-0.5 flex-1 box-border pl-1'}>
            <p className={'font-medium text-gray-500'}>
                CHÍNH SÁCH
            </p>
            <h1 className={'text-lg font-medium text-green-700 line-clamp-4'}>{item.title}</h1>
            {
                item.text ? <div
                    className={'text-gray-500 text-md line-clamp-2 prose'}
                    dangerouslySetInnerHTML={{__html: item.text as string}}
                /> : ''
            }
        </div>
    </Link>
}
