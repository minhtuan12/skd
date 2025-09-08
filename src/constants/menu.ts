import {routes} from "@/constants/routes";
import {Home, MapPin, Newspaper, TreePalm} from "lucide-react";

export interface Menu {
    title: string;
    href: string;
    children?: Menu[];
    hasPages?: boolean;
}

export const menu: Menu[] = [
    {
        title: 'Trang chủ',
        href: routes.TrangChu
    },
    {
        title: 'Thông tin chính sách',
        href: routes.ThongTinChinhSach,
        children: [
            {
                title: 'Chiến lược Sức khỏe đất Quốc gia',
                href: routes.ChienLuoc
            },
            {
                title: 'Kế hoạch hành động sức khỏe đất',
                href: routes.KeHoach
            },
            {
                title: 'Các văn bản chính sách liên quan',
                href: routes.ChinhSach,
                hasPages: true
            }
        ]
    },
    {
        title: 'Bản đồ',
        href: routes.BanDo,
        children: [
            {
                title: 'Bản đồ đất',
                href: routes.BanDoDat
            },
            {
                title: 'Các trung tâm quan trắc đất',
                href: routes.CacTrungTamQuanTracDat
            }
        ]
    },
    {
        title: 'Ngân hàng kiến thức',
        href: routes.NganHangKienThuc,
        children: []
    },
    {
        title: 'Tin tức và sự kiện',
        href: routes.TinTucVaSuKien,
        children: [
            {
                title: 'Tin tức và sự kiện',
                href: routes.TinTucSuKien
            },
            {
                title: 'Nghiên cứu',
                href: routes.NghienCuu,
                hasPages: true
            }
        ]
    },
    {
        title: 'Hỏi đáp và liên hệ',
        href: routes.HoiDapVaLienHe,
        children: [
            {
                title: 'Hỏi đáp',
                href: routes.HoiDap
            },
            {
                title: 'Liên hệ',
                href: routes.LienHe
            }
        ]
    },
    {
        title: 'Giới thiệu',
        href: routes.GioiThieu,
        children: [
            {
                title: 'Giới thiệu về sức khỏe đất',
                href: routes.SucKhoeDat
            },
            {
                title: 'Giới thiệu về dự án',
                href: routes.DuAn
            }
        ]
    }
]

export const sideBarItems = [
    {
        title: 'Cấu hình',
        children: [
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
                    {
                        title: "Kế hoạch hành động SKĐ",
                        url: routes.Plan,
                        icon: Newspaper,
                    },
                    {
                        title: "Chiến lược SKĐ Quốc gia",
                        url: routes.Strategy,
                        icon: Newspaper,
                    },
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
                ]
            },
            {
                title: "Bản đồ đất",
                url: routes.MapConfig,
                icon: MapPin,
            },
        ]
    },
]
