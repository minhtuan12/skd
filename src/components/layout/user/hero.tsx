import Image from "next/image";
import AnimatedSection from "@/components/custom/animated-section";

export default function Hero({data}: { data: { title: string, description: string, image_url: string } }) {
    return <AnimatedSection
        asTag={"section"} className="text-green-500 py-30 text-center relative"
        initial={{opacity: 0, y: -50}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8}}
    >
        <Image
            src={data.image_url as string}
            alt="Đất khỏe cho cây trồng khỏe"
            layout="fill"
            objectFit="cover"
        />
        <div className={'relative z-20 px-4 md:px-0 box-border'}>
            <h2 className="text-4xl font-bold">{data.title}</h2>
            <p className="mt-4 text-[14px]">{data.description}</p>
        </div>
    </AnimatedSection>
}
