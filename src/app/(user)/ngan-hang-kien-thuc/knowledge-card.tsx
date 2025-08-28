import Image from "next/image";
import {cn} from "@/lib/utils";
import {IKnowledge, KnowledgeTypes} from "@/models/knowledge";

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
    const tag = {
        [KnowledgeTypes.farming]: 'KỸ THUẬT CẢI TẠO ĐẤT',
        [KnowledgeTypes.training]: 'TÀI LIỆU TẬP HUẤN',
        [KnowledgeTypes.renovation]: 'KỸ THUẬT CANH TÁC',
        [KnowledgeTypes.model]: 'MÔ HÌNH ĐIỂN HÌNH',
    }
    const isTechnique = knowledge.category === KnowledgeTypes.farming || knowledge.category === KnowledgeTypes.renovation;

    return <div className={cn(className, 'flex flex-col gap-4')}>
        <div className={cn(imageClassname, `rounded-xl`)}>
            <Image
                src={knowledge?.media?.url as string}
                alt={isTechnique ? knowledge.name as string : knowledge.description as string}
                width={0}
                height={0}
                style={{width: '100%', height: 'auto'}}
                sizes="100vw"
                className={'rounded-xl object-cover'}
            />
        </div>
        <div className={'flex flex-col gap-0.5 flex-1 box-border pl-1'}>
            <p className={'font-medium'}>
                {tag[knowledge.category]}
            </p>
            {isTechnique ? <h1 className={'text-lg font-medium text-green-700 line-clamp-4'}>{knowledge.name}</h1> : ''}
            <div className={'text-gray-500 text-md line-clamp-2'}
                 dangerouslySetInnerHTML={{__html: knowledge.description as string}}/>
        </div>
    </div>
}
