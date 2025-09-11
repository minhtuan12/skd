import Link from "next/link";
import AnimatedSection from "@/components/custom/animated-section";
import {ArrowRight, ChevronRight} from "lucide-react";
import CardWithTitle from "@/components/custom/card-with-title";
import {VideoPlayer} from "@/components/ui/video";
import MapWrapper from "@/components/custom/map-wrapper";
import {INewsAndEvents} from "@/models/config";
import {dateOptions, NEWS_EVENTS} from "@/constants/common";
import Image from "next/image";
import {IPolicyDocument} from "@/models/policy-document";
import {buildDetailPath} from "@/lib/utils";

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

async function fetchKnowledgeCategories() {
    const res = await fetch(`${baseUrl}/api/config/knowledge-category`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch config');
    }
    return res.json();
}

export default async function Home() {
    const {config: {home}} = await fetchHomeConfig();
    const {pages} = await fetchKnowledgeCategories();

    return (
        <>
            {/* Intro Section */}
            <AnimatedSection
                asTag={'section'}
                className="h-auto my-14 px-10 lg:px-10 xl:px-40 flex flex-col sm:flex-row items-center justify-between gap-10"
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                viewport={{once: true}}
            >
                <div className={'max-md:w-full w-1/2'}>
                    <h2 className="text-4xl max-lg:text-2xl font-semibold mb-4">Giới thiệu về Sức khỏe đất</h2>
                    <p className="max-w-2xl text-lg max-lg:text-base text-justify">
                        {home.introduction.content}
                    </p>
                    <div className="mt-6">
                        <Link href={'/gioi-thieu/suc-khoe-dat'}>
                            <button
                                className="cursor-pointer hover:opacity-90 font-medium bg-blue-600 text-white px-5 py-2.5 rounded-[10px] flex items-center justify-center gap-2">
                                Tìm hiểu thêm
                                <ArrowRight width={16} strokeWidth={'3'}/>
                            </button>
                        </Link>
                    </div>
                </div>
                <Image
                    src={home.introduction.image_url}
                    alt="Giới thiệu về Sức khỏe Đất"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={'w-[35%] 2xl:w-[calc(100vw-95%)] h-auto max-md:w-[45%] max-sm:w-[60%] max-lg:w-1/2'}
                />
            </AnimatedSection>

            {/* Grid Sections */}
            <section
                className="h-auto min-[1595px]:h-[1000px] min-[2015px]:h-[1300px] box-border py-16 px-10 lg:px-10 xl:px-40 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-18 bg-[#FAF9FF]">
                <CardWithTitle
                    border title={'Bản đồ đất'} bgTitleColor={'bg-[#c7ceea]'}
                    className={'max-md:h-150 h-full min-[1595px]:!h-full'}
                    href="/ban-do/ban-do-dat"
                >
                    <div className={'flex flex-col gap-3 h-full'}>
                        <h5 className={'text-black font-semibold text-[15px]'}>Bản đồ</h5>
                        <div className={'flex-1'}>
                            <MapWrapper/>
                        </div>
                    </div>
                    <Link href="/ban-do/ban-do-dat"
                          className="mt-4 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">Xem
                        bản
                        đồ <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                </CardWithTitle>

                <CardWithTitle
                    border title={'Bản đồ các trung tâm phân tích'} bgTitleColor={'bg-[#FFDAC1]'}
                    className={'max-md:h-150 h-full min-[1595px]:!h-full'}
                    href="/ban-do/cac-trung-tam-quan-trac-dat"
                >
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
                    <Link href="/ban-do/cac-trung-tam-quan-trac-dat"
                          className="mt-4 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">Xem
                        tài liệu
                        <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                </CardWithTitle>

                <div className={'flex flex-col gap-5 max-md:h-auto h-[600px] lg:h-auto'}>
                    <CardWithTitle
                        border title={'Chính Sách Nông Nghiệp'} bgTitleColor={'bg-[#ff9aa2]'}
                        className={'h-auto md:h-1/2'} childrenBg={'justify-between'}
                        href={"/thong-tin-chinh-sach/chinh-sach/1"}
                    >
                        <div className={'flex flex-col gap-2 h-auto md:h-[calc(100%-50px)]'}>
                            <h5 className={'text-black font-semibold text-[15px]'}>Thông tin chính sách</h5>
                            <ul
                                className={'flex flex-col gap-2 flex-1 overflow-auto max-h-full text-justify pr-2 list-disc'}>
                                {home.agricultural_policy.map((item: IPolicyDocument) => (
                                    <Link
                                        href={item.link || `/ngan-hang-kien-thuc/chi-tiet/${buildDetailPath(item.title, item._id as string)}`}
                                        key={item._id}
                                        className={'flex items-center text-base underline hover:text-blue-500'}
                                    >
                                        • {item.title}
                                    </Link>
                                ))}
                            </ul>
                        </div>
                        <Link href="/thong-tin-chinh-sach/chinh-sach/1"
                              className="mt-4 md:mt-0 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">
                            Xem chính sách
                            <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                    </CardWithTitle>
                    <CardWithTitle
                        border title={'Ngân hàng kiến thức'} bgTitleColor={'bg-[#ffffd8]'}
                        className={'h-auto md:h-1/2 min-[1595px]:h-2/3'}
                        href={`/ngan-hang-kien-thuc/${buildDetailPath(pages[0].name, pages[0]._id)}/1`}
                    >
                        <VideoPlayer src={home.knowledge_bank_video_url}/>
                        <Link href={`/ngan-hang-kien-thuc/${buildDetailPath(pages[0].name, pages[0]._id)}/1`}
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
                <h4 className={'text-md font-medium mt-1 text-center text-gray-600'}>Cập nhật các hoạt động, nghiên cứu
                    và tin tức nổi bật trong lĩnh vực.</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {
                        home.news_and_events.map((item: INewsAndEvents, i: number) => {
                            const detailPath = buildDetailPath(item.title, item._id as string);

                            return <Link href={`/tin-tuc-va-su-kien/chi-tiet/${detailPath}`} key={i}>
                                <CardWithTitle
                                    border
                                    title={item.title} bgTitleColor={'green'} titleHeight={'!h-50'}
                                    childrenBg={'bg-gray-100'}
                                    className={'cursor-pointer'}
                                    bgImageUrl={item.image_url as string}
                                >
                                    <div className={'text-[14px] text-gray-500'}>
                                        {NEWS_EVENTS[item.type as keyof typeof NEWS_EVENTS]} | {new Date(item.date).toLocaleDateString('vi-VN', dateOptions as any)}
                                    </div>
                                    <div className={'flex flex-col mt-1 flex-1 min-[1400px]:gap-2'}>
                                        <h4 className={'font-semibold text-lg'}>{item.title}</h4>
                                        <div className="text-[15px] text-gray-500 font-medium prose"
                                             dangerouslySetInnerHTML={{__html: item.description}}
                                        />
                                    </div>
                                </CardWithTitle>
                            </Link>
                        })
                    }
                </div>
                <Link href={'/tin-tuc-va-su-kien/tin-tuc-su-kien'}
                      className={'text-blue-600 font-medium flex items-center justify-end mt-5'}>Xem thêm <ChevronRight
                    className={'w-4 h-4 text-blue-600 mt-0.5'}/></Link>
            </AnimatedSection>
        </>
    );
}
