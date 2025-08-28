import {routes} from "@/constants/routes";
import {Home, Newspaper, Tractor, TreePalm} from "lucide-react";

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
                href: routes.ChinhSach
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
        children: [
            {
                title: 'Tài liệu tập huấn',
                href: routes.TaiLieuTapHuan,
                hasPages: true
            },
            {
                title: 'Kỹ thuật canh tác thân thiện với sức khỏe đất',
                href: routes.KyThuatCanhTac,
                hasPages: true
            },
            {
                title: 'Kỹ thuật cải tạo đất',
                href: routes.KyThuatCaiTaoDat,
                hasPages: true
            },
            {
                title: 'Mô hình điển hình',
                href: routes.MoHinhDienHinh,
                hasPages: true
            }
        ]
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
            },
            {
                title: "Ngân hàng kiến thức",
                url: routes.KnowledgeConfig,
                icon: Newspaper,
                children: [
                    {
                        title: "Quản lý nhóm cây",
                        url: routes.TreeTypeManagement,
                        icon: TreePalm,
                    },
                    {
                        title: "Tài liệu tập huấn",
                        url: routes.Training,
                        icon: Newspaper,
                    },
                    {
                        title: "Kỹ thuật canh tác",
                        url: routes.Farming,
                        icon: Tractor,
                    },
                    {
                        title: "Kỹ thuật cải tạo đất",
                        url: routes.Renovation,
                        icon: Newspaper,
                    },
                    {
                        title: "Mô hình điển hình",
                        url: routes.Model,
                        icon: Newspaper,
                    },
                ]
            },
        ]
    },
]
