import Link from "next/link";
import AnimatedSection from "@/components/custom/animated-section";
import {ArrowRight, ChevronRight} from "lucide-react";
import CardWithTitle from "@/components/custom/card-with-title";
import {VideoPlayer} from "@/components/ui/video";
import MapWrapper from "@/components/custom/map-wrapper";
import {INewsAndEvents} from "@/models/config";
import {dateOptions, NEWS_EVENTS} from "@/constants/common";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchHomeConfig() {
    const res = await fetch(`${baseUrl}/api/config?page=home`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch config');
    }
    return res.json();
}

export default async function Home() {
    const {config: {home}} = await fetchHomeConfig();

    return (
        <>
            {/* Intro Section */}
            <AnimatedSection
                asTag={'section'}
                className="h-auto sm:h-100 my-14 px-10 lg:px-10 xl:px-40 flex flex-col sm:flex-row items-center justify-between gap-10"
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                viewport={{once: true}}
            >
                <div className={'w-full sm:w-1/2'}>
                    <h2 className="text-2xl font-semibold mb-4">Giới thiệu về Sức khỏe đất</h2>
                    <p className="max-w-2xl text-[14px]">
                        {home.introduction.content}
                    </p>
                    <div className="mt-6">
                        <button
                            className="cursor-pointer hover:opacity-90 font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-[10px] flex items-center justify-center gap-2">
                            Tìm hiểu thêm
                            <ArrowRight width={16} strokeWidth={'3'}/>
                        </button>
                    </div>
                </div>
                <AnimatedSection
                    asTag={'div'}
                    className="bg-[#a4ef1f] relative p-16 sm:p-4 rounded shadow-lg h-full w-full sm:w-1/2 flex items-center justify-center"
                    whileHover={{scale: 1.03}}
                    transition={{type: "spring", stiffness: 300}}
                >
                    <Image
                        src={home.introduction.image_url}
                        alt="Giới thiệu về Sức khỏe Đất"
                        layout="fill"
                        objectFit="cover"
                    />
                </AnimatedSection>
            </AnimatedSection>

            {/* Grid Sections */}
            <section
                className="h-auto min-[1595px]:h-[1000px] min-[2015px]:h-[1300px] box-border py-16 px-10 lg:px-10 xl:px-40 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-18 bg-[#FAF9FF]">
                <CardWithTitle border title={'Bản đồ Đất Việt Nam'} bgTitleColor={'bg-blue-500'}
                               className={'lg:h-[700px] h-[600px] min-[1595px]:!h-full'}>
                    <div className={'flex flex-col gap-3 h-full'}>
                        <h5 className={'text-black font-semibold text-[15px]'}>Bản đồ</h5>
                        <div className={'flex-1'}>
                            <MapWrapper/>
                        </div>
                    </div>
                    <Link href="#" className="mt-4 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">Xem
                        bản
                        đồ <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                </CardWithTitle>

                <CardWithTitle border title={'Bản đồ các trung tâm quan trắc'} bgTitleColor={'bg-yellow-400'}
                               className={'lg:h-[700px] h-[600px] min-[1595px]:!h-full'}>
                    <div className={'flex flex-col gap-3 h-full'}>
                        <h5 className={'text-black font-semibold text-[15px]'}>Ngân hàng kiến thức</h5>
                        <div className={'flex-1'}>
                            <MapWrapper marks={[
                                [105.8342, 21.0278], // Hà Nội
                                [108.2062, 16.0471], // Đà Nẵng
                                [106.6602, 10.7626], // TP. HCM
                                [109.2193, 13.7563], // Quy Nhơn
                                [103.9718, 22.3964], // Lào Cai
                                [108.9874, 11.5671], // Phan Thiết
                                [105.6814, 18.6822], // Vinh
                                [108.2772, 14.0583], // Trung Việt Nam
                                [106.3456, 9.8426],  // Bến Tre
                                [107.0448, 20.9712]  // Hạ Long
                            ]}/>
                        </div>
                    </div>
                    <Link href="#" className="mt-4 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">Xem
                        tài liệu
                        <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                </CardWithTitle>

                <div className={'flex flex-col gap-5 max-md:h-auto h-[600px] lg:h-auto'}>
                    <CardWithTitle border title={'Chính Sách Nông Nghiệp'} bgTitleColor={'bg-orange-400'}
                                   className={'h-auto md:h-1/2'} childrenBg={'justify-between'}>
                        <div className={'flex flex-col gap-2 h-auto md:h-[calc(100%-50px)]'}>
                            <h5 className={'text-black font-semibold text-[15px]'}>Thông tin chính sách</h5>
                            <div className={'text-[13px] flex-1 overflow-auto max-h-full'}>
                                {home.agricultural_policy}
                            </div>
                        </div>
                        <Link href="#"
                              className="mt-4 md:mt-0 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">Xem
                            chính sách
                            <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                    </CardWithTitle>
                    <CardWithTitle border title={'Ngân hàng kiến thức'} bgTitleColor={'bg-yellow-300'}
                                   className={'h-auto md:h-1/2 min-[1595px]:h-2/3'}>
                        <VideoPlayer src={home.knowledge_bank_video_url}/>
                        <Link href="#"
                              className="mt-4 md:mt-0 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">Xem
                            tài liệu
                            <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                    </CardWithTitle>
                </div>
            </section>

            {/* News */}
            <AnimatedSection
                asTag={'section'}
                className="mx-auto px-10 lg:px-10 xl:px-40 pb-30"
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                transition={{duration: 0.5}}
                viewport={{once: true}}
            >
                <h2 className="text-2xl font-semibold text-center">Tin tức và Sự kiện mới nhất</h2>
                <h4 className={'text-sm font-medium mt-1 text-center text-gray-600'}>Cập nhật các hoạt động, nghiên cứu
                    và tin tức nổi bật trong lĩnh vực.</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {
                        home.news_and_events.map((item: INewsAndEvents, i: number) => (
                            <Link href={'#'} key={i}>
                                <CardWithTitle
                                    border
                                    title={item.title} bgTitleColor={'green'} titleHeight={'!h-50'}
                                    childrenBg={'bg-gray-100'}
                                    className={'cursor-pointer'}
                                    bgImageUrl={item.image_url as string}
                                >
                                    <div className={'text-[12px] text-gray-500'}>
                                        {NEWS_EVENTS[item.type as keyof typeof NEWS_EVENTS]} | {new Date(item.date).toLocaleDateString('vi-VN', dateOptions as any)}
                                    </div>
                                    <div className={'flex flex-col mt-1 flex-1 min-[1400px]:gap-2'}>
                                        <h4 className={'font-semibold text-base'}>{item.title}</h4>
                                        <p className="text-[12px] text-gray-500 font-medium">{item.description}</p>
                                    </div>
                                </CardWithTitle>
                            </Link>
                        ))
                    }
                </div>
            </AnimatedSection>
        </>
    );
}
