import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Post from "@/models/post";
import SectionModel from "@/models/section";

async function getPostDetail(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;
        const post: any = await Post.findById(id).populate('related_posts').lean();
        let relatedPosts: any = [];
        for (let item of post.related_posts) {
            if (item.title) {
                relatedPosts.push({...item, is_section_post: false});
            } else {
                const section = await SectionModel.findOne({post_id: item._id});
                relatedPosts.push({
                    ...item,
                    title: section.name,
                    image_url: section.image_url,
                    is_section_post: true,
                });
            }
        }
        return NextResponse.json({post: {...post, related_posts: relatedPosts}});
    } catch (error) {
        console.error('Get post detail API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getPostDetail;
