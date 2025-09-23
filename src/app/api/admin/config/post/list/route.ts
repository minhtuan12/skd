import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import {Types} from "mongoose";
import Post from "@/models/post";
import SectionModel, {SectionType} from "@/models/section";

async function getPosts(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const key = searchParams.get('key');
        const sectionId = searchParams.get('sectionId');
        if (!sectionId) {
            const posts = await Post.find({header_key: key, title: {$ne: ''}}).sort('order');
            return NextResponse.json({posts});
        }

        const listSections = await SectionModel.find({
            header_key: key,
            type: SectionType.post,
            is_deleted: false
        }).populate('post_id').lean();

        return NextResponse.json({posts: listSections.map((item: any) => ({...item, title: item.name}))});
    } catch (error) {
        console.error('Get posts API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getPosts);
