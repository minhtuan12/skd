import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import NewsEvents from "@/models/news-events";
import {withAuth} from "@/app/api/middleware";
import {sanitizeHtml} from "@/lib/utils";

async function getNewsEvents(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const type = searchParams.get('type');
        const typeCondition = type !== 'all' ? {type} : {};
        const newsEvents = await NewsEvents.find({...typeCondition}).sort('-createdAt');

        return NextResponse.json({news_events: newsEvents, type});
    } catch (error) {
        console.error('Config API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function addNewsEvents(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Thiếu các trường cần cập nhật'},
                {status: 400}
            );
        }

        const newNewsEvents = new NewsEvents({
            title: data.title,
            description: sanitizeHtml(data.description),
            image_url: data.image_url,
            date: data.date,
            type: data.type,
            related_posts: data.related_posts
        });
        await newNewsEvents.save();

        return NextResponse.json(
            JSON.stringify({message: "Thêm mới thành công"}),
            {status: 201}
        );
    } catch (error) {
        console.error('Config API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getNewsEvents);
export const POST = withAuth(addNewsEvents);
