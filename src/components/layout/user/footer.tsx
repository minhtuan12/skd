import Link from "next/link";
import {routes} from "@/constants/routes";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchFooter() {
    const res = await fetch(`${baseUrl}/api/config/footer`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch footer');
    }
    return res.json();
}

export default async function Footer({traffic}: { traffic: number }) {
    const {footer} = await fetchFooter();
    const social = [
        {
            href: footer.about_us.facebook || '#',
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
            href: footer.about_us.youtube || '#',
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
            href: footer.about_us.email || '#',
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

    return <>
        <div className="w-full h-2 bg-[linear-gradient(to_right,_#3B82F6_0%,_white_49%,_#FACC15_51%,_white_100%)]"/>
        <footer
            className="bg-[#1E2637] text-white pt-10 box-border h-auto pb-[50px] px-10 lg:px-10 xl:px-40 mx-auto">
            <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-sm h-auto">
                <div>
                    <h5 className="font-bold mb-2 text-base">VỀ CHÚNG TÔI</h5>
                    <p className={'text-[15px] text-gray-400 mt-3'}>
                        {footer.about_us.text}
                    </p>
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
                    <ul className="space-y-2 text-[15px] text-gray-400 mt-3">
                        <li><Link href="/muc-luc/policy">Thông tin chính sách</Link></li>
                        <li><Link href="/muc-luc/map">Bản đồ</Link></li>
                        <li><Link href="/muc-luc/knowledge">Ngân hàng kiến thức</Link></li>
                        <li><Link href="/muc-luc/news">Tin tức & Sự kiện</Link></li>
                        <li><Link href="/muc-luc/contact">Hỏi đáp & Liên hệ</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-2 text-base">LIÊN HỆ</h5>
                    <div className="space-y-3 text-[15px] text-gray-400 mt-3">
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
                            {footer.contact.address}
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
                            {footer.contact.phone}
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
                            {footer.contact.email}
                        </p>
                    </div>
                </div>
                <div>
                    <h5 className="font-bold mb-2 text-base">ĐỐI TÁC & NHÀ TÀI TRỢ</h5>
                    <div className="space-y-2 text-[15px] text-gray-400 mt-3">
                        {
                            (footer.sponsors || [])?.map((s: string, index: number) => (
                                <p key={index}>{s}</p>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={'text-end mt-2 text-[14px] text-gray-400 max-md:text-start max-md:mt-6'}>
                <span className={'text-green-400 mr-1'}>•</span> Lượng truy cập: {traffic}
            </div>
            <div className="h-[2px] bg-gray-100 opacity-10 w-full mt-2"></div>
            <div
                className="mt-2 lg:mt-6 text-[15px] text-gray-400 flex w-full justify-between max-sm:flex max-sm:flex-col-reverse max-sm:gap-4">
                <p className={'max-sm:text-center'}>© 2025 Bản quyền thuộc về Cổng thông tin Sức khỏe đất.</p>
                <div className={'flex items-center gap-4 max-sm:w-full max-sm:justify-between'}>
                    <Link href={'#'}>Điều khoản sử dụng</Link>
                    <Link href={routes.DangNhapAdmin}>ADMIN LOGIN</Link>
                </div>
            </div>
        </footer>
    </>
}
