import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import SectionModel from "@/models/section";
import Post from "@/models/post";

async function getPost(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const id = searchParams.get('id');
        const post: any = await SectionModel.findOne({is_deleted: false, post_id: id}).populate('post_id').lean();
        if (!post.post_id) {
            return NextResponse.json({post});
        }
        let relatedPosts: any = [];
        for (let postId of post.post_id.related_posts) {
            const item: any = await Post.findById(postId).lean();
            if (item.title) {
                relatedPosts.push({...item, is_section_post: false});
            } else {
                const section = await SectionModel.findOne({post_id: postId});
                relatedPosts.push({
                    ...item,
                    title: section.name,
                    image_url: section.image_url,
                    is_section_post: true,
                });
            }
        }
        return NextResponse.json({post: {...post, post_id: {...post.post_id, related_posts: relatedPosts}}});
    } catch (error) {
        console.error('Get post API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getPost;
