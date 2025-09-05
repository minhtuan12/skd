import {cloudinaryService} from "@/service/cloudinary";
import cloudinary from "@/lib/cloudinary";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchPolicy(page: 'strategy' | 'plan' | 'document') {
    const res = await fetch(`${baseUrl}/api/config?page=policy`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch config');
    }

    let {config: {policy}} = await res.json();
    if (!policy[page]?.draft_ppt_link) {
        return {
            draft_ppt_link: '#',
            download_notification: '',
            slides: []
        };
    }

    const parts = policy[page].draft_ppt_link.split('/');
    const publicId = parts[parts.length - 2] + '/' + parts[parts.length - 1];
    const pages = await cloudinaryService.convertPptxToImages(publicId);
    let slides = [];
    for (let i = 1; i <= pages; i++) {
        slides.push(cloudinary.url(
            publicId,
            {resource_type: "image", format: "jpg", page: i,})
        )
    }

    return {...policy[page], slides}
}