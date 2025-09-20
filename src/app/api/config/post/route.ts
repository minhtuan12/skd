import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Post from "@/models/post";
import SectionModel from "@/models/section";

async function getPost(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const id = searchParams.get('id');
        const post = await SectionModel.findOne({is_deleted: false, post_id: id}).populate('post_id');
        return NextResponse.json({post});
    } catch (error) {
        console.error('Get post API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getPost;
