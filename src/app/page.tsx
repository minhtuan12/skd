import Link from "next/link";
import AnimatedSection from "@/components/custom/animated-section";
import Image from "next/image";
import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ArrowRight, ChevronDown, ChevronRight, Search} from "lucide-react";
import CardWithTitle from "@/components/custom/card-with-title";
import {Input} from "@/components/ui/input";
import LeafletWrapper from "@/components/custom/leaflet-map-wrapper";
import VideoPlayer from "@/components/ui/video";
import GoToTopButton from "@/components/ui/to-top-button";

export default function Home() {
    const news = [
        {
            title: 'Hội Thảo Quốc Gia',
            type: 'Sự kiện',
            date: '15/06/2025',
            heading: 'Hội thảo quốc gia về giải pháp phục hồi đất nông nghiệp bị thoái hóa',
            description: 'Hội thảo đã quy tụ nhiều chuyên gia đầu ngành để thảo luận về các thách thức và đưa ra giải pháp...',
            bgTitleColor: 'bg-lime-500'
        },
        {
            title: 'Mô Hình Canh Tác Thông Minh',
            type: 'Nghiên cứu',
            date: '12/06/2025',
            heading: 'Nghiên cứu mới về mô hình canh tác thông minh thích ứng biến đổi khí hậu',
            description: 'Mô hình mới cho thấy hiệu quả rõ rệt trong việc cải thiện độ phì của đất và tăng năng suất...',
            bgTitleColor: 'bg-emerald-500'
        },
        {
            title: 'Phát Động Chương Trình',
            type: 'Tin tức',
            date: '10/06/2025',
            heading: 'Phát động chương trình "Triệu nông dân vì sức khỏe đất" tại Đồng bằng sông Cửu Long',
            description: 'Chương trình nhằm nâng cao nhận thức và tập huấn kỹ thuật cho bà con nông dân trong khu vực...',
            bgTitleColor: 'bg-orange-500'
        }
    ]

    const social = [
        {
            href: '#',
            icon: <svg fill="#e6e6e6" width="20px" height="20px" viewBox="0 0 32 32"
                       xmlns="http://www.w3.org/2000/svg" stroke="#e6e6e6">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"
                   stroke="#CCCCCC" strokeWidth="0.576"></g>
                <g id="SVGRepo_iconCarrier">
                    <path
                        d="M21.95 5.005l-3.306-.004c-3.206 0-5.277 2.124-5.277 5.415v2.495H10.05v4.515h3.317l-.004 9.575h4.641l.004-9.575h3.806l-.003-4.514h-3.803v-2.117c0-1.018.241-1.533 1.566-1.533l2.366-.001.01-4.256z"></path>
                </g>
            </svg>
        }, {
            href: '#',
            icon: <svg fill="#e6e6e6" height="15px" width="15px" version="1.1" id="Layer_1"
                       xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                       viewBox="-271 311.2 256 179.8" xmlSpace="preserve" stroke="#e6e6e6">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path
                        d="M-59.1,311.2h-167.8c0,0-44.1,0-44.1,44.1v91.5c0,0,0,44.1,44.1,44.1h167.8c0,0,44.1,0,44.1-44.1v-91.5 C-15,355.3-15,311.2-59.1,311.2z M-177.1,450.3v-98.5l83.8,49.3L-177.1,450.3z"></path>
                </g>
            </svg>
        },
        {
            href: '#',
            icon: <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg"
                       xmlnsXlink="http://www.w3.org/1999/xlink" width="15px" height="15px" viewBox="0 0 512.00 512.00"
                       xmlSpace="preserve" fill="#e6e6e6" stroke="#e6e6e6" strokeWidth="20.48">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <path className="st0"
                              d="M496.563,68.828H15.438C6.922,68.828,0,75.75,0,84.281v30.391l256,171.547l256-171.563V84.281 C512,75.75,505.078,68.828,496.563,68.828z"></path>
                        <path className="st0"
                              d="M0,178.016v203.391c0,34.125,27.641,61.766,61.781,61.766h388.438c34.141,0,61.781-27.641,61.781-61.766V178 L256,349.563L0,178.016z"></path>
                    </g>
                </g>
            </svg>
        }
    ]

    return (
        <main className="min-h-screen w-full">
            <header className="bg-white text-white pt-1 h-auto min-[1115px]:h-27 top-0 sticky z-999 shadow-lg">
                <div
                    className="mx-auto px-4 md:px-10 lg:px-12 xl:px-32 flex min-[1115px]:flex-row flex-col min-[1115px]:items-end items-center justify-center min-[1115px]:justify-between h-full pb-2.5 max-[1115px]:gap-5 max-sm:flex-row">
                    <div className={'flex items-end justify-between h-full max-[1115px]:gap-10 max-sm:gap-0 gap-1'}>
                        <div className={'flex flex-col items-start w-32 h-full max-sm:w-12'}>
                            <div className={'w-18 h-18 max-sm:w-12 max-sm:h-12 relative'}>
                                <Image src={'/logos/principles.png'} alt={''} fill/>
                            </div>
                            <h3 className={'absolute max-[1115px]:top-[calc(100%-58px)] max-sm:hidden top-20 text-black max-sm:text-[13px] text-[15px] font-bold'}>SỨC
                                KHỎE ĐẤT</h3>
                        </div>
                        <div className={'flex flex-col justify-between min-[1115px]:gap-6 gap-2 max-[1115px]:mt-6'}>
                            {/* Logos */}
                            <div className={'flex gap-2 max-sm:hidden max-[1115px]:justify-center'}>
                                <div className={'w-8 h-8 relative'}>
                                    <Image src={'/logos/vietnam_emblem.png'} alt={''} fill/>
                                </div>
                                <div className={'w-[114px] h-8 relative'}>
                                    <Image src={'/logos/fao_logo.png'} alt={''} fill/>
                                </div>
                                <div className={'w-[137px] h-8 relative'}>
                                    <Image src={'/logos/institute_logo.png'} alt={''} fill/>
                                </div>
                            </div>
                            {/* Headers */}
                            <div
                                className="container max-sm:hidden mx-auto flex items-center justify-between text-gray-500 font-semibold text-[13px]">
                                <nav className="space-x-4 max-[1115px]:text-center">
                                    <Link href="#">Trang chủ</Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger textOnly>
                                            <div className={'flex items-center'}>
                                                <div className={'hover:opacity-80'}>Thông tin chính sách</div>
                                                <ChevronDown
                                                    width={14}
                                                    className={'mt-[3px]'}
                                                />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Chính sách 1</Link>
                                            </DropdownMenuLabel>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Chính sách 2</Link>
                                            </DropdownMenuLabel>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Chính sách 3</Link>
                                            </DropdownMenuLabel>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Link href="#">Bản đồ</Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger textOnly>
                                            <div className={'flex items-center'}>
                                                <div className={'hover:opacity-80'}>Ngân hàng kiến thức</div>
                                                <ChevronDown
                                                    width={14}
                                                    className={'mt-[3px]'}
                                                />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Kiến thức 1</Link>
                                            </DropdownMenuLabel>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Kiến thức 2</Link>
                                            </DropdownMenuLabel>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Kiến thức 3</Link>
                                            </DropdownMenuLabel>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger textOnly>
                                            <div className={'flex items-center'}>
                                                <div className={'hover:opacity-80'}>Tin tức & Sự kiện</div>
                                                <ChevronDown
                                                    width={14}
                                                    className={'mt-[3px]'}
                                                />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Tin tức</Link>
                                            </DropdownMenuLabel>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Sự kiện</Link>
                                            </DropdownMenuLabel>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger textOnly>
                                            <div className={'flex items-center'}>
                                                <div className={'hover:opacity-80'}>Hỏi đáp & Liên hệ</div>
                                                <ChevronDown
                                                    width={14}
                                                    className={'mt-[3px]'}
                                                />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Hỏi đáp</Link>
                                            </DropdownMenuLabel>
                                            <DropdownMenuLabel>
                                                <Link href={'#'}>Liên hệ</Link>
                                            </DropdownMenuLabel>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </nav>
                            </div>
                        </div>
                    </div>
                    {/* Search input */}
                    <div className={'flex items-center gap-8 max-sm:mt-4'}>
                        <div className={'max-sm:flex hidden'}>
                            <DropdownMenu>
                                <DropdownMenuTrigger textOnly>
                                    <div className={'flex items-center text-gray-500 font-semibold text-[15px]'}>
                                        <div className={'hover:opacity-80'}>Menu</div>
                                        <ChevronDown
                                            width={14}
                                            className={'mt-[3px]'}
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </div>
                        <div className={'w-50 relative h-7'}>
                            <Input placeholder={'Tìm kiếm...'}
                                   className={'w-full h-full rounded-[30px] !text-[13px] text-black !pr-7 box-border'}/>
                            <Search color="#8f8f8f" width={16}
                                    className={'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'}/>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <AnimatedSection
                asTag={"section"} className="bg-green-700 text-white py-30 text-center relative"
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}>
                <h1 className={'px-4 md:px-0 box-border w-full text-7xl font-bold absolute z-10 text-gray-400 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'}>Đất
                    Khỏe Cho Cây Trồng Khỏe</h1>
                <div className={'relative z-20 px-4 md:px-0 box-border'}>
                    <h2 className="text-4xl font-bold">Bảo vệ sức khỏe đất là bảo vệ tương lai</h2>
                    <p className="mt-4 text-[14px]">Chung tay hành động vì một nông nghiệp bền vững, thịnh vượng và thân
                        thiện
                        với môi trường.</p>
                </div>
            </AnimatedSection>

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
                        Sức khỏe đất là khả năng của đất hoạt động như một hệ sinh thái sống, có vai trò duy trì đa dạng
                        sinh học, năng suất cây trồng, chất lượng nước và không khí, cũng như sức khỏe của con người và
                        động
                        vật. Cách tiếp cận "Một Sức khỏe" (One Health) nhấn mạnh mối liên hệ mật thiết và không thể tách
                        rời
                        giữa các yếu tố này.
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
                    className="bg-[#a4ef1f] p-16 sm:p-4 rounded shadow-lg h-full w-full sm:w-1/2 flex items-center justify-center"
                    whileHover={{scale: 1.03}}
                    transition={{type: "spring", stiffness: 300}}
                >
                    <h2 className="text-center font-semibold mb-2 text-white text-5xl">Sức Khỏe Đất</h2>
                </AnimatedSection>
            </AnimatedSection>

            {/* Grid Sections */}
            <section
                className="h-auto box-border py-16 px-10 lg:px-10 xl:px-40 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-18 bg-[#FAF9FF]">
                <CardWithTitle border title={'Bản đồ Đất Việt Nam'} bgTitleColor={'bg-blue-500'}
                               className={'lg:h-[700px] h-[600px]'}>
                    <div className={'flex flex-col gap-3 h-full'}>
                        <h5 className={'text-black font-semibold text-[15px]'}>Bản đồ</h5>
                        <div className={'flex-1'}>
                            <LeafletWrapper/>
                        </div>
                    </div>
                    <Link href="#" className="mt-4 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">Xem
                        bản
                        đồ <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                </CardWithTitle>

                <CardWithTitle border title={'Bản đồ các trung tâm quan trắc'} bgTitleColor={'bg-yellow-400'}
                               className={'lg:h-[700px] h-[600px]'}>
                    <div className={'flex flex-col gap-3 h-full'}>
                        <h5 className={'text-black font-semibold text-[15px]'}>Ngân hàng kiến thức</h5>
                        <div className={'flex-1'}>
                            <LeafletWrapper marks={[
                                [21.0278, 105.8342], // Hà Nội
                                [16.0471, 108.2062], // Đà Nẵng
                                [10.7626, 106.6602], // TP. HCM
                                [13.7563, 109.2193], // Quy Nhơn
                                [22.3964, 103.9718], // Lào Cai
                                [11.5671, 108.9874], // Phan Thiết
                                [18.6822, 105.6814], // Vinh
                                [14.0583, 108.2772], // Trung Việt Nam
                                [9.8426, 106.3456],  // Bến Tre
                                [20.9712, 107.0448], // Hạ Long
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
                            <div className={'text-[13px] flex-1 overflow-auto max-h-full'}>Lorem ipsum
                                dolor
                                sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut
                                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem
                                ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis
                                aute
                                iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
                                mollit anim id est laborum.
                            </div>
                        </div>
                        <Link href="#"
                              className="mt-4 md:mt-0 text-blue-600 w-fit flex items-center gap-1 text-[13px] font-medium">Xem
                            chính sách
                            <ChevronRight width={13} className={'mt-[3px]'}/></Link>
                    </CardWithTitle>
                    <CardWithTitle border title={'Ngân hàng kiến thức'} bgTitleColor={'bg-yellow-300'}
                                   className={'h-auto md:h-1/2'}>
                        <VideoPlayer src={'/videos/knowledge.mp4'}/>
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
                        news.map((item, i) => (
                            <Link href={'#'} key={i}>
                                <CardWithTitle
                                    border
                                    title={item.title} bgTitleColor={item.bgTitleColor} titleHeight={'!h-50'}
                                    childrenBg={'bg-gray-100'}
                                    className={'cursor-pointer'}
                                >
                                    <div className={'text-[12px] text-gray-500'}>{item.type} | {item.date}</div>
                                    <div className={'flex flex-col justify-between mt-1 flex-1'}>
                                        <h4 className={'font-semibold text-base'}>{item.heading}</h4>
                                        <p className="text-[12px] text-gray-500 font-medium">{item.description}</p>
                                    </div>
                                </CardWithTitle>
                            </Link>
                        ))
                    }
                </div>
            </AnimatedSection>

            {/* Footer */}
            <div className="w-full h-2 bg-[linear-gradient(to_right,_#3B82F6_0%,_white_49%,_#FACC15_51%,_white_100%)]"/>
            <footer
                className="bg-[#1E2637] text-white pt-10 box-border h-auto pb-4 lg:pb-0 lg:h-75 px-10 lg:px-10 xl:px-40 mx-auto">
                <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                    <div>
                        <h5 className="font-bold mb-2 text-base">VỀ CHÚNG TÔI</h5>
                        <p className={'text-[13px] text-gray-400 mt-3'}>Ngân hàng kiến thức trực tuyến về Sức khỏe đất
                            là
                            cổng
                            thông tin chính thức, cung cấp tài liệu, chính sách và dữ liệu đáng tin cậy.</p>
                        <div className={'mt-4 flex items-center gap-[10px]'}>
                            {social.map((item, i) => (
                                <div className={`w-5 h-5 ${i > 0 ? 'mt-1' : ''}`} key={i}>
                                    <Link href={item.href} className={'flex items-center justify-center'}>
                                        {item.icon}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold mb-2 text-base">LIÊN KẾT NHANH</h5>
                        <ul className="space-y-2 text-[13px] text-gray-400 mt-3">
                            <li><Link href="#">Thông tin chính sách</Link></li>
                            <li><Link href="#">Ngân hàng kiến thức</Link></li>
                            <li><Link href="#">Tin tức & Sự kiện</Link></li>
                            <li><Link href="#">Hỏi đáp & Liên hệ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-2 text-base">LIÊN HỆ</h5>
                        <div className="space-y-3 text-[13px] text-gray-400 mt-3">
                            <p className={'flex items-center gap-2'}>
                                <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                     xmlnsXlink="http://www.w3.org/1999/xlink" width="15px" height="15px"
                                     viewBox="0 0 64 64" enableBackground="new 0 0 64 64" xmlSpace="preserve"
                                     fill="#e6e6e6">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fill="#e6e6e6"
                                              d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"></path>
                                    </g>
                                </svg>
                                Số 2 Ngọc Hà, Ba Đình, Hà Nội
                            </p>
                            <p className={'flex items-center gap-1'}>
                                <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" transform="rotate(270)">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z"
                                            fill="#e6e6e6"></path>
                                    </g>
                                </svg>
                                (024) 3843 5432
                            </p>
                            <p className={'flex items-center gap-2'}>
                                <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg"
                                     xmlnsXlink="http://www.w3.org/1999/xlink" width="15px" height="15px"
                                     viewBox="0 0 512.00 512.00"
                                     xmlSpace="preserve" fill="#e6e6e6" stroke="#e6e6e6" strokeWidth="20.48">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <g>
                                            <path className="st0"
                                                  d="M496.563,68.828H15.438C6.922,68.828,0,75.75,0,84.281v30.391l256,171.547l256-171.563V84.281 C512,75.75,505.078,68.828,496.563,68.828z"></path>
                                            <path className="st0"
                                                  d="M0,178.016v203.391c0,34.125,27.641,61.766,61.781,61.766h388.438c34.141,0,61.781-27.641,61.781-61.766V178 L256,349.563L0,178.016z"></path>
                                        </g>
                                    </g>
                                </svg>
                                lienhe.skd@map.gov.vn
                            </p>
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold mb-2 text-base">ĐỐI TÁC & NHÀ TÀI TRỢ</h5>
                        <div className="space-y-2 text-[13px] text-gray-400 mt-3">
                            <p>Bộ Nông nghiệp & PTNT</p>
                            <p>Tổ chức Lương thực và Nông nghiệp Liên Hợp Quốc (FAO)</p>
                        </div>
                    </div>
                </div>
                <div className="h-[2px] bg-gray-100 opacity-10 w-full mt-4 lg:mt-10"></div>
                <div
                    className="mt-2 lg:mt-6 text-xs text-gray-400 flex w-full justify-between max-sm:flex max-sm:flex-col-reverse max-sm:gap-4">
                    <p className={'max-sm:text-center'}>© 2025 Bản quyền thuộc về Cổng thông tin Sức khỏe đất.</p>
                    <div className={'flex items-center gap-4 max-sm:w-full max-sm:justify-between'}>
                        <Link href={'#'}>Điều khoản sử dụng</Link>
                        <Link href={'#'}>ADMIN LOGIN</Link>
                    </div>
                </div>
            </footer>

            <GoToTopButton/>
        </main>
    );
}
