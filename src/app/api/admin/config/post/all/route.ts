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
        const listSections = await SectionModel.find({
            header_key: key,
            type: SectionType.list
        });
        // const onePostList = await SectionModel.find({header_key: key, post_id: {$ne: null}, type: SectionType.post});

        const postIds = [
            ...listSections.flatMap((section) => section.post_ids || []),
            // ...onePostList.map((i: any) => i.post_id)
        ]

        if (postIds.length === 0) {
            return NextResponse.json({posts: []});
        }

        const posts = await Post.find({
            _id: {$in: postIds},
        });

        return NextResponse.json({posts});
    } catch (error) {
        console.error('Get posts API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getPosts);
