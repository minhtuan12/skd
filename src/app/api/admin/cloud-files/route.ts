import {NextRequest, NextResponse} from 'next/server';
import {cloudinaryService} from "@/service/cloudinary";
import {withAuth} from "@/app/api/middleware";

async function getFiles(request: NextRequest) {
    try {
        const results = await cloudinaryService.listImages(process.env.CLOUDINARY_UPLOAD_FOLDER!, 100);
        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            {error: 'Tải file lên thất bại'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getFiles);
