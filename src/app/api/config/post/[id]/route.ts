import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Post from "@/models/post";

async function getPostDetail(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;
        const post = await Post.findById(id).populate('related_posts');
        return NextResponse.json({post});
    } catch (error) {
        console.error('Get post detail API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getPostDetail;
