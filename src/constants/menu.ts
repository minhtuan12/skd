import {routes} from "@/constants/routes";
import {Home, MapPin, Newspaper, TreePalm} from "lucide-react";

export interface Menu {
    title: string;
    href: string;
    children?: Menu[];
    hasPages?: boolean;
    key: string;
}

export const menu: Menu[] = [
    {
        title: 'Trang chủ',
        href: routes.TrangChu,
        key: 'home'
    },
    {
        title: 'Thông tin chính sách',
        href: routes.MucLuc,
        key: 'policy',
        children: [
            // {
            //     title: 'Chiến lược Sức khỏe đất Quốc gia',
            //     href: routes.ChienLuoc
            // },
            // {
            //     title: 'Kế hoạch hành động sức khỏe đất',
            //     href: routes.KeHoach
            // },
            // {
            //     title: 'Các văn bản chính sách liên quan',
            //     href: routes.ChinhSach,
            //     hasPages: true
            // }
        ]
    },
    {
        title: 'Bản đồ',
        href: routes.MucLuc,
        key: 'map',
        children: [
            // {
            //     title: 'Bản đồ đất',
            //     href: routes.BanDoDat
            // },
            // {
            //     title: 'Các trung tâm phân tích',
            //     href: routes.CacTrungTamQuanTracDat
            // }
        ]
    },
    {
        title: 'Ngân hàng kiến thức',
        href: routes.MucLuc,
        children: [],
        key: 'knowledge'
    },
    {
        title: 'Tin tức và sự kiện',
        href: routes.MucLuc,
        key: 'news',
        children: [
            // {
            //     title: 'Tin tức và sự kiện',
            //     href: routes.TinTucSuKien
            // },
            // {
            //     title: 'Nghiên cứu',
            //     href: routes.NghienCuu,
            //     hasPages: true
            // }
        ]
    },
    {
        title: 'Hỏi đáp và liên hệ',
        href: routes.MucLuc,
        key: 'contact',
        children: [
            // {
            //     title: 'Hỏi đáp',
            //     href: routes.HoiDap
            // },
            // {
            //     title: 'Liên hệ',
            //     href: routes.LienHe
            // }
        ]
    },
    {
        title: 'Giới thiệu',
        href: routes.MucLuc,
        key: 'introduction',
        children: [
            // {
            //     title: 'Giới thiệu về sức khỏe đất',
            //     href: routes.SucKhoeDat
            // },
            // {
            //     title: 'Giới thiệu về dự án',
            //     href: routes.DuAn
            // }
        ]
    }
]

export const sideBarItems = [
    {
        title: 'Cấu hình',
        children: [
            {
                title: "Quản lý các trang",
                url: '/admin/config/pages',
                icon: Home,
            },
            {
                title: "Quản lý bài viết",
                url: '/admin/config/posts',
                icon: Home,
            },
            {
                title: "Trang chủ",
                url: routes.HomeConfig,
                icon: Home,
            },
            {
                title: "Tin tức, sự kiện & nghiên cứu",
                url: routes.NewsConfig,
                icon: Newspaper,
            },
            {
                title: "Thông tin chính sách",
                url: routes.PolicyConfig,
                icon: Newspaper,
                children: [
                    // {
                    //     title: "Kế hoạch hành động SKĐ",
                    //     url: routes.Plan,
                    //     icon: Newspaper,
                    // },
                    // {
                    //     title: "Chiến lược SKĐ Quốc gia",
                    //     url: routes.Strategy,
                    //     icon: Newspaper,
                    // },
                    {
                        title: "Văn bản chính sách",
                        url: routes.Document,
                        icon: Newspaper,
                    },
                ]
            },
            {
                title: "Ngân hàng kiến thức",
                url: routes.KnowledgeConfig,
                icon: Newspaper,
                children: [
                    {
                        title: "Quản lý trang",
                        url: routes.Pages,
                        icon: TreePalm,
                    },
                    {
                        title: "Quản lý bài đăng",
                        url: routes.Post,
                        icon: TreePalm,
                    },
                ]
            },
            {
                title: "Bản đồ",
                url: '',
                icon: Newspaper,
                children: [
                    {
                        title: "Bản đồ đất",
                        url: routes.MapConfig,
                        icon: MapPin,
                    },
                    {
                        title: "Phòng thí nghiệm",
                        url: routes.LabConfig,
                        icon: MapPin,
                    },
                ]
            },
            // {
            //     title: "Giới thiệu",
            //     url: routes.IntroductionConfig,
            //     icon: Newspaper,
            //     children: [
            //         {
            //             title: "Sức khỏe đất",
            //             url: routes.Land,
            //             icon: TreePalm,
            //         },
            //         {
            //             title: "Dự án",
            //             url: routes.Project,
            //             icon: TreePalm,
            //         },
            //     ]
            // },
        ]
    },
]
