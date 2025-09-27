import Image from "next/image";
import {buildDetailPath, cn} from "@/lib/utils";
import {IKnowledge} from "@/models/knowledge";
import Link from "next/link";

export default function KnowledgeCard(
    {
        knowledge,
        className = '',
        imageClassname = '',
        imageHeight,
    }:
    {
        knowledge: IKnowledge,
        className?: string,
        imageClassname?: string,
        imageHeight?: number,
    }
) {
    const detailPath = buildDetailPath(knowledge.name, knowledge._id as string);
    return <Link
        href={knowledge.link || `/ngan-hang-kien-thuc/chi-tiet/${detailPath}`}
        className={cn(className, 'flex flex-col gap-4')}
    >
        <div className={cn(imageClassname, `rounded-md 2xl:h-[265px] xl:h-[200px] md:h-[150px] border border-gray-300`)}>
            <Image
                src={knowledge?.media?.url as string || '/logos/principles.png'}
                alt={knowledge.name as string}
                width={0}
                height={0}
                style={{width: '100%', height: '100%'}}
                sizes="100vw"
                className={'rounded-md object-cover'}
            />
        </div>
        <div className={'flex flex-col gap-0.5 flex-1 box-border pl-1'}>
            <p className={'font-medium text-gray-500'}>
                {(knowledge as any).category_name.toUpperCase()}
            </p>
            <h1 className={'text-lg font-medium text-green-700 line-clamp-4'}>{knowledge.name}</h1>
            {
                knowledge.text ? <div
                    className={'text-gray-500 line-clamp-2 prose !text-md [&>h1]:text-sm'}
                    dangerouslySetInnerHTML={{__html: (knowledge.text || '').replace(/<img[^>]*>/gi, "") as string}}
                /> : ''
            }
        </div>
    </Link>
}
