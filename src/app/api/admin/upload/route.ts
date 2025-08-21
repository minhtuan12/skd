import {NextRequest, NextResponse} from 'next/server';
import {cloudinaryService} from "@/service/cloudinary";
import {getResourceType} from "@/app/api/helpers";
import cloudinary from "@/lib/cloudinary";

const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER!;

async function uploadFile(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('file') as File[];
        const keys = formData.getAll('key') as string[];
        const types = formData.getAll('type') as string[];
        const oldUrls = formData.getAll('oldUrl') as string[];

        if (!files || !files.length) {
            return NextResponse.json(
                {error: 'Thiếu file tải lên'},
                {status: 400}
            );
        }

        const results = [];

        for (let i = 0; i < files.length; i++) {
            if (oldUrls[i]) {
                const urlParts = oldUrls[i].split('/');
                const publicIdAndType = urlParts[urlParts.length - 1].split('.');
                const resourceType = getResourceType(publicIdAndType[1]);
                const publicId = resourceType === 'image' ?
                    `${uploadFolder}/${publicIdAndType[0]}`
                    : `videos/${publicIdAndType[0]}`;
                await cloudinaryService.deleteFile(publicId, resourceType as any);
            }

            const bytes = await files[i].arrayBuffer();
            const buffer = Buffer.from(bytes);

            let result;
            switch (types[i]) {
                case 'image':
                    result = await cloudinaryService.uploadFile(buffer, {
                        folder: uploadFolder,
                        tags: ['upload'],
                        resource_type: 'auto'
                    });
                    break;
                case 'video':
                    result = await cloudinaryService.uploadVideoChunked(buffer);
                    break;
                default:
                    result = await cloudinaryService.uploadFile(buffer, {
                        folder: uploadFolder,
                        tags: ['upload'],
                        resource_type: 'raw',
                        raw_convert: "aspose",
                        format: 'pptx'
                    });
                    break;
            }

            results.push({
                public_id: result.public_id,
                url: result.url,
                key: keys[i],
                type: types[i]
            });
        }

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

async function deleteFile(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const publicId = searchParams.get('publicId');
        const resourceType = searchParams.get('resourceType') || 'image';

        if (!publicId) {
            return NextResponse.json(
                {error: 'Public ID is required'},
                {status: 400}
            );
        }

        const result = await cloudinaryService.deleteFile(publicId, resourceType as any);

        return NextResponse.json({
            success: true,
            result
        });

    } catch (error) {
        console.error('Delete API error:', error);
        return NextResponse.json(
            {error: 'Xóa file thất bại'},
            {status: 500}
        );
    }
}

// export const POST = withAuth(uploadFile);
export const POST = (uploadFile);
