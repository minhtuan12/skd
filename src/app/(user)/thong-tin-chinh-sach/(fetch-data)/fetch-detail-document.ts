import {cloudinaryService} from "@/service/cloudinary";
import cloudinary from "@/lib/cloudinary";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchDetailDocument(id: string) {
    const res = await fetch(`${baseUrl}/api/config/policy-document/${id}`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch document');
    }

    const result = await res.json();
    let slides = [];
    if (result?.document?.slide?.url) {
        const slideUrl = result?.document.slide?.url;
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

    return result.document ? {
        ...result.document,
        slides
    } : null;
}
