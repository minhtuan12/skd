import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import NewsEvents from "@/models/news-events";

const {ObjectId} = Types

async function getDetailNews(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;

        const item = await NewsEvents.findOne({
            is_deleted: false,
            _id: new ObjectId(id)
        }).populate('related_posts');
        return NextResponse.json({news: item || null});
    } catch (error) {
        console.error('Get detail news API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getDetailNews;
