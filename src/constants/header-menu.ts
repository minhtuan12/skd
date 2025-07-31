export interface Menu {
    title: string;
    href: string;
    children?: Menu[]
}

export const menu: Menu[] = [
    {
        title: 'Trang chủ',
        href: '/'
    },
    {
        title: 'Thông tin chính sách',
        href: '/thong-tin-chinh-sach',
        children: [
            {
                title: 'Chiến lược SKĐ Quốc gia',
                href: '/chien-luoc'
            },
            {
                title: 'Kế hoạch hành đồng sức khỏe đất',
                href: '/ke-hoach'
            },
            {
                title: 'Các văn bản chính sách liên quan',
                href: '/chinh-sach'
            }
        ]
    },
    {
        title: 'Bản đồ',
        href: '/ban-do',
        children: [
            {
                title: 'Bản đồ đất',
                href: '/ban-do-dat'
            },
            {
                title: 'Các trung tâm quan trắc đất',
                href: '/cac-trung-tam-quan-trac-dat'
            }
        ]
    },
    {
        title: 'Ngân hàng kiến thức',
        href: '/ngan-hang-kien-thuc',
        children: [
            {
                title: 'Tài liệu tập huấn',
                href: '/tai-lieu-tap-huan'
            },
            {
                title: 'Kỹ thuật canh tác thân thiện với sức khỏe đất',
                href: '/ky-thuat-canh-tac'
            },
            {
                title: 'Kỹ thuật cải tạo đất',
                href: '/ky-thuat-cai-tao-dat'
            },
            {
                title: 'Mô hình điển hình',
                href: '/mo-hinh-dien-hinh'
            }
        ]
    },
    {
        title:'Tin tức và sự kiện',
        href: '/tin-tuc-va-su-kien',
        children: [
            {
                title: 'Tin tức và sự kiện',
                href: '/tin-tuc-su-kien'
            },
            {
                title: 'Nghiên cứu',
                href: '/nghien-cuu'
            }
        ]
    },
    {
        title: 'Hỏi đáp và liên hệ',
        href: '/hoi-dap-va-lien-he',
        children: [
            {
                title: 'Hỏi đáp',
                href:'/hoi-dap'
            },
            {
                title: 'Liên hệ',
                href:'/lien-he'
            }
        ]
    },
    {
        title: 'Giới thiệu',
        href: '/gioi-thieu',
        children: [
            {
                title: 'Giới thiệu về sức khỏe đất',
                href:'/suc-khoe-dat'
            },
            {
                title: 'Giới thiệu về dự án',
                href:'/du-an'
            }
        ]
    }
]
