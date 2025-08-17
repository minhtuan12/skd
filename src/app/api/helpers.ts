import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Config from "@/models/config";
import NewsEvents from "@/models/news-events";
import {Types} from "mongoose";

const {ObjectId} = Types;

const imageExtensions = ['jpeg', 'png', 'jpg', 'gif', 'bmp', 'tiff', 'tif', 'svg', 'ico', 'webp'];
const videoExtensions = ['mp4', 'm4v', 'm4p', 'mov', 'qt', 'avi', 'wmv', 'mkv', 'webm', 'mts', 'm2ts', 'ts', 'ogv', 'ogg', '3gp', 'flv'];

export async function getConfig(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const page = searchParams.get('page');
        let config: any;
        if (page) {
            config = await Config.findOne().select(page).lean();
            if (page === 'home' && config?.home?.news_and_events) {
                const newsAndEvents = await NewsEvents.find({
                    _id: {$in: config.home.news_and_events.map((id: string) => new ObjectId(id))}
                })
                config = {
                    ...config,
                    home: {
                        ...config.home,
                        news_and_events: newsAndEvents
                    }
                }
            }
        } else {
            config = await Config.findOne().lean();
        }

        if (!config) {
            return NextResponse.json(
                {error: 'Không tồn tại thông tin cấu hình'},
                {status: 404}
            );
        }

        return NextResponse.json({config});
    } catch (error) {
        console.error('Config API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export function getResourceType(extension: string) {
    if (imageExtensions.includes(extension.toLowerCase())) {
        return 'image';
    }
    if (videoExtensions.includes(extension.toLowerCase())) {
        return 'video';
    }
    return 'raw';
}
