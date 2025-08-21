import PptViewer from "@/components/custom/ppt-viewer";
import {Loader2} from "lucide-react";
import React from "react";
import {fetchPolicy} from "@/app/(user)/thong-tin-chinh-sach/fetchPolicy";
import {fetchHomeConfig} from "@/app/(user)/thong-tin-chinh-sach/fetchHomeConfig";
import Image from "next/image";
import AnimatedSection from "@/components/custom/animated-section";

async function fetchStrategyConfig() {
    try {
        return await fetchPolicy('strategy');
    } catch (error) {
        console.error(error);
        return {
            draft_ppt_link: '#',
            slides: []
        };
    }
}

export default async function ChienLuoc() {
    const policy = await fetchStrategyConfig();
    const {config: {home}} = await fetchHomeConfig();

    return <div className={'box-border pb-12 flex flex-col gap-6'}>
        <AnimatedSection
            asTag={"section"} className="text-green-500 py-30 text-center relative"
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
        >
            <Image
                src={home.banner.image_url as string}
                alt="Đất khỏe cho cây trồng khỏe"
                layout="fill"
                objectFit="cover"
            />
            <div className={'relative z-20 px-4 md:px-0 box-border'}>
                <h2 className="text-4xl font-bold">{home.banner.title}</h2>
                <p className="mt-4 text-[14px]">{home.banner.description}</p>
            </div>
        </AnimatedSection>
        <h1 className={'font-semibold text-center text-xl'}>CHIẾN LƯỢC SỨC KHỎE ĐẤT QUỐC GIA</h1>
        <div className={'flex-1'}>
            {!policy ? <div className={'flex items-center justify-center h-full w-full mt-8'}><Loader2
                    className="h-6 w-6 animate-spin"/></div> :
                (
                    policy.draft_ppt_link === '#' ? <div className={'text-gray-500 font-medium italic  w-full text-center'}>
                        Chưa có bản dự thảo nào
                    </div> : <PptViewer slides={policy.slides} pptUrl={policy.draft_ppt_link}/>
                )
            }
        </div>
    </div>
}
