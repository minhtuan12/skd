import {cloudinaryService} from "@/service/cloudinary";
import cloudinary from "@/lib/cloudinary";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchDetailKnowledge(id: string) {
    const res = await fetch(`${baseUrl}/api/config/knowledge/${id}`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch knowledge');
    }

    const result = await res.json();
    let slides = [];
    if (result?.knowledge?.slide?.url) {
        const slideUrl = result?.knowledge.slide?.url;
        const parts = slideUrl.split('/');
        const publicId = parts[parts.length - 2] + '/' + parts[parts.length - 1];
        const pages = await cloudinaryService.convertPptxToImages(publicId);
        for (let i = 1; i <= pages; i++) {
            slides.push(cloudinary.url(
                publicId,
                {resource_type: "image", format: "jpg", page: i,})
            )
        }
    }

    return result.knowledge ? {
        ...result.knowledge,
        slides
    } : null;
}
