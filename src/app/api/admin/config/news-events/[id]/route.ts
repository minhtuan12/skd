import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import NewsEvents from "@/models/news-events";
import {withAuthWithContext} from "@/app/api/middleware";
import {sanitizeHtml} from "@/lib/utils";

const {ObjectId} = Types

async function updateNewsEvents(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Thiếu các trường cần cập nhật'},
                {status: 400}
            );
        }

        const result = await NewsEvents.findOneAndUpdate(
            {_id: new ObjectId(id)},
            !Object.keys(data).includes('is_deleted') ? {
                $set: {
                    title: data.title,
                    description: sanitizeHtml(data.description),
                    image_url: data.image_url,
                    date: data.date,
                    type: data.type,
                    related_posts: data.related_posts
                }
            } : {
                $set: {
                    is_deleted: data.is_deleted,
                }
            }
        )

        if (!result) {
            return NextResponse.json(
                JSON.stringify({message: "Không tồn tại"}),
                {status: 404}
            );
        }
        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Config API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = withAuthWithContext(updateNewsEvents);
