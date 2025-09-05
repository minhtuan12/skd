import Image from "next/image";
import {Menu, menu} from "@/constants/menu";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronDown, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import MobileMenuWrapper from "@/components/layout/user/mobile-menu-wrapper";
import MobileMenu from "@/components/layout/user/mobile-menu";

export default function Header() {
    return <header className="bg-white text-white pt-1 h-auto min-[1115px]:h-27 top-0 sticky z-9999 shadow-lg">
        <div
            className="pb-1 mx-auto max-lg:px-8 max-[335px]:!px-2 max-[1024px]:justify-between max-sm:pb-1.5 px-4 md:px-10 lg:px-22 min-[1280px]:max-[1300px]:px-24 flex max-[1115px]:!px-12 min-[1115px]:items-end items-center justify-center min-[1115px]:justify-between h-full min-[1024px]:pb-2.5 max-[1115px]:gap-5 max-sm:flex-row max-sm:!px-4 min-[1024px]:max-[1115px]:pt-4">
            <div
                className={'max-[1024px]:w-fit flex items-end justify-between h-full max-[1115px]:gap-10 max-sm:gap-0 gap-1 w-full'}>
                <Link
                    href={'/'}
                    className={'flex flex-col items-start w-32 h-full max-[1024px]:w-12 max-[1115px]:relative max-[1115px]:-top-5 max-[1024px]:top-0 min-[1024px]:max-[1115px]:-top-4'}>
                    <div className={'w-18 h-18 max-[1024px]:w-12 max-[1024px]:h-12 relative'}>
                        <Image src={'/logos/principles.png'} alt={''} fill/>
                    </div>
                    <h3 className={'absolute max-[1115px]:top-[97%] max-[1024px]:hidden top-20 text-black max-sm:text-[13px] text-[15px] font-bold'}>SỨC
                        KHỎE ĐẤT</h3>
                </Link>
                <div
                    className={'flex flex-col justify-between min-[1115px]:gap-4 gap-2 flex-1 max-[1024px]:hidden'}>
                    {/* Logos */}
                    <div
                        className={'flex items-center min-[1115px]:gap-20 max-[1115px]:justify-between max-lg:justify-center'}>
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
                        {/* Search input */}
                        <div className={'hidden items-center gap-8 max-sm:mt-0 max-[1315px]:flex max-lg:hidden'}>
                            <div className={'w-50 relative h-7 max-[335px]:w-36'}>
                                <Input placeholder={'Tìm kiếm...'}
                                       className={'w-full h-full rounded-[30px] !text-[13px] text-black !pr-7 box-border'}/>
                                <Search color="#8f8f8f" width={16}
                                        className={'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'}/>
                            </div>
                        </div>
                    </div>

                    {/* Headers */}
                    <div
                        className="container max-[1024px]:hidden mx-auto flex items-center justify-between text-gray-500 font-semibold text-[13px]">
                        <nav
                            className="max-lg:flex-wrap max-lg:justify-center max-lg:space-x-6 space-x-6 max-[1115px]:text-center min-[1115px]:space-x-4 flex max-[1115px]:space-x-0 max-[1115px]:w-full max-[1115px]:justify-between">
                            {
                                menu.map((item: Menu, index: number) => (
                                    !item?.children ? <Link key={index} href={item.href} className={'flex w-fit mt-1'}>
                                            {item.title}
                                            <ChevronDown
                                                width={14}
                                                className={''}
                                            />
                                        </Link> :
                                        <DropdownMenu key={index}>
                                            <DropdownMenuTrigger textOnly>
                                                <div className={'flex items-center'}>
                                                    <div className={'hover:opacity-80'}>{item.title}</div>
                                                    <ChevronDown
                                                        width={14}
                                                        className={'mt-[2px]'}
                                                    />
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {item.children.map((child: Menu, i: number) =>
                                                    <DropdownMenuLabel key={i}>
                                                        <Link
                                                            href={item.href + child.href + (child.hasPages ? '/1' : '')}
                                                            className={'w-full block'}
                                                        >
                                                            {child.title}
                                                        </Link>
                                                    </DropdownMenuLabel>)}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                ))
                            }
                        </nav>
                    </div>
                </div>
            </div>
            {/* Search input */}
            <div className={'flex items-center gap-8 max-sm:mt-0 max-[1315px]:hidden max-lg:flex'}>
                <div className={'w-50 relative h-7 max-[335px]:w-36'}>
                    <Input placeholder={'Tìm kiếm...'}
                           className={'w-full h-full rounded-[30px] !text-[13px] text-black !pr-7 box-border'}/>
                    <Search color="#8f8f8f" width={16}
                            className={'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'}/>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={'max-[1024px]:flex hidden'}>
                <MobileMenuWrapper>
                    <MobileMenu/>
                </MobileMenuWrapper>
            </div>
        </div>
    </header>
}
