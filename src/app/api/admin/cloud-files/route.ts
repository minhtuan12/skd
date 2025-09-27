import {NextRequest, NextResponse} from 'next/server';
import {cloudinaryService} from "@/service/cloudinary";
import {withAuth} from "@/app/api/middleware";
import Config from "@/models/config";
import MapModel from "@/models/map";
import NewsEvents from "@/models/news-events";
import Post from "@/models/post";
import SectionModel from "@/models/section";

async function getFiles(request: NextRequest) {
    try {
        let results = await cloudinaryService.listImages(process.env.CLOUDINARY_UPLOAD_FOLDER!, 100);
        let images = [];

        const homeConfig: any = await Config.findOne({}).select("home").lean();
        images.push(homeConfig.home.introduction.image_url);
        for (let item of homeConfig.home.banner) {
            if (item.image_url) {
                images.push(item.image_url);
            }
        }
        for (let item of homeConfig.home.ads) {
            if (item.image_url) {
                images.push(item.image_url);
            }
        }
        // Maps
        const maps = await MapModel.find({});
        for (let item of maps) {
            if (item.image_url) {
                images.push(item.image_url);
            }
        }
        // News
        const news = await NewsEvents.find({});
        for (let item of news) {
            if (item.image_url) {
                images.push(item.image_url);
            }
        }
        // Posts
        const posts = await Post.find({});
        for (let item of posts) {
            if (item.image_url) {
                images.push(item.image_url);
            }
        }
        // Section
        const sections = await SectionModel.find({});
        for (let item of sections) {
            if (item.image_url) {
                images.push(item.image_url);
            }
        }

        const imagesMap = new Set(images);
        results = {
            ...results,
            resources: results.resources.map((i: any) => ({
                ...i,
                used: imagesMap.has(i.url) || imagesMap.has(i.secure_url)
            }))
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

async function deleteFiles(request: NextRequest) {
    try {
        const {data} = await request.json();
        await cloudinaryService.deleteMultipleFiles(data.publicIds, 'image');
        return NextResponse.json(
            JSON.stringify({message: "Xóa thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Delete files API error:', error);
        return NextResponse.json(
            {error: 'Xóa file thất bại'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getFiles);
export const DELETE = withAuth(deleteFiles);
