import Image from "next/image";
import {Menu, menu} from "@/constants/menu";
import Link from "next/link";
import {House, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import MobileMenuWrapper from "@/components/layout/user/mobile-menu-wrapper";
import MobileMenu from "@/components/layout/user/mobile-menu";
import {buildDetailPath} from "@/lib/utils";
import {routes} from "@/constants/routes";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchKnowledgeCategory() {
    const res = await fetch(`${baseUrl}/api/config/knowledge-category`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch knowledge category');
    }
    return res.json();
}

export default async function Header() {
    const categories = await fetchKnowledgeCategory();
    const menuItems = menu.map(item => {
        if (item.href === routes.NganHangKienThuc) {
            return {
                ...item,
                children: categories?.pages?.map((i: any) => ({
                    title: i.name,
                    href: `/${buildDetailPath(i.name, i._id)}`,
                    hasPages: true
                }))
            };
        }
        return item;
    })

    return <header className="bg-white text-white pt-1 h-auto min-[1115px]:h-27 top-0 sticky z-9999 shadow-lg">
        <div
            className="pb-1 mx-auto max-lg:px-8 max-[335px]:!px-2 max-[1024px]:justify-between max-sm:pb-1.5 px-4 md:px-10 lg:px-22 min-[1280px]:max-[1300px]:px-24 flex max-[1115px]:!px-12 min-[1115px]:items-end items-center justify-center min-[1115px]:justify-between h-full min-[1024px]:pb-2.5 max-[1115px]:gap-5 max-sm:flex-row max-sm:!px-4 min-[1024px]:max-[1115px]:pt-4">
            <div
                className={'max-[1024px]:w-fit flex items-end justify-between h-full max-[1115px]:gap-10 max-sm:gap-0 gap-1 w-full'}>
                <Link
                    href={'/'}
                    className={'flex flex-col items-start w-32 h-full max-[1024px]:w-12 max-[1115px]:relative max-[1115px]:-top-5 max-[1024px]:top-0 min-[1024px]:max-[1115px]:-top-4'}>
                    <div className={'w-18 h-18 max-[1024px]:w-12 max-[1024px]:h-12 relative ml-5'}>
                        <Image src={'/logos/principles.png'} alt={''} fill/>
                    </div>
                    <h3 className={'absolute max-[1115px]:top-[97%] max-[1024px]:hidden top-20 text-black max-sm:text-[13px] text-[15px] font-bold'}>SỨC
                        KHỎE ĐẤT</h3>
                </Link>
                <div
                    className={'flex flex-col justify-between min-[1023px]:gap-4 min-[1023px]:max-[1114px]:gap-4 gap-2 flex-1 max-[1024px]:hidden -mb-[3px]'}>
                    {/* Logos */}
                    <div
                        className={'flex items-center min-[1115px]:gap-20 max-[1115px]:justify-between max-lg:justify-center'}>
                        <div className={'flex gap-4 max-sm:hidden max-[1115px]:justify-center'}>
                            <div className={'w-8 h-8 relative'}>
                                <Image src={'/logos/vietnam_emblem.png'} alt={''} fill/>
                            </div>
                            <div className={'w-[114px] h-8 relative'}>
                                <Image src={'/logos/fao_logo.png'} alt={''} fill/>
                            </div>
                            <Link target={'_blank'} href={'https://sfri.org.vn/'} className={'w-[137px] h-8 relative'}>
                                <Image src={'/logos/institute_logo.png'} alt={''} fill/>
                            </Link>
                            <div className={'w-[73px] h-8 relative'}>
                                <Image src={'/logos/aei_logo.png'} alt={''} fill/>
                            </div>
                        </div>
                        {/* Search input */}
                        <div className={'hidden items-center gap-8 max-sm:mt-0 max-[1352px]:flex max-lg:hidden'}>
                            <div className={'w-50 relative h-7 max-[335px]:w-36'}>
                                <Input placeholder={'Tìm kiếm...'}
                                       className={'w-full h-full rounded-[30px] !text-md text-black !pr-7 box-border'}/>
                                <Search color="#8f8f8f" width={16}
                                        className={'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'}/>
                            </div>
                        </div>
                    </div>

                    {/* Headers */}
                    <div
                        className="container max-[1024px]:hidden flex items-center justify-between text-black 2xl:text-[17px] text-sm">
                        <nav
                            className="items-center max-lg:flex-wrap max-lg:justify-center max-lg:space-x-6 space-x-6 max-[1115px]:text-center min-[1115px]:space-x-4 flex max-[1115px]:space-x-0 max-[1115px]:w-full max-[1115px]:justify-between">
                            <NavigationMenu viewport={false}>
                                <NavigationMenuList>
                                    {
                                        menuItems.map((item: Menu, index: number) => (
                                            !item?.children ?
                                                <Link key={index} href={item.href} className={'flex w-fit -mt-0.5'}>
                                                    <House/>
                                                </Link> :
                                                <NavigationMenuItem key={index}>
                                                    <NavigationMenuTrigger>
                                                        {item.title}
                                                    </NavigationMenuTrigger>
                                                    <NavigationMenuContent className={'w-auto space-y-3'}>
                                                        {item.children.map((child: Menu, i: number) =>
                                                            <NavigationMenuLink key={i} asChild>
                                                                <Link
                                                                    href={item.href + child.href + (child.hasPages ? '/1' : '')}
                                                                    className={'w-full block'}
                                                                >
                                                                    {child.title}
                                                                </Link>
                                                            </NavigationMenuLink>
                                                        )}
                                                    </NavigationMenuContent>
                                                </NavigationMenuItem>
                                        ))
                                    }
                                </NavigationMenuList>
                            </NavigationMenu>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Search input */}
            <div className={'flex items-center gap-8 max-sm:mt-0 max-[1352px]:hidden max-lg:flex'}>
                <div className={'w-50 relative h-8 max-[335px]:w-36'}>
                    <Input placeholder={'Tìm kiếm...'}
                           className={'w-full h-full rounded-[30px] !text-base text-black !pr-7 box-border'}/>
                    <Search color="#8f8f8f" width={16}
                            className={'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'}/>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={'max-[1024px]:flex hidden'}>
                <MobileMenuWrapper>
                    <MobileMenu menuItems={menuItems}/>
                </MobileMenuWrapper>
            </div>
        </div>
    </header>
}
