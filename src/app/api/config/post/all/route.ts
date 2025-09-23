import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import Post from "@/models/post";
import SectionModel, {SectionType} from "@/models/section";

async function getPosts(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const key = searchParams.get('key');
        const posts = await Post.find({header_key: key, title: {$ne: ''}});

        return NextResponse.json({posts});
    } catch (error) {
        console.error('Get posts API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getPosts;
