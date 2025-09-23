import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import SectionModel from "@/models/section";
import Post from "@/models/post";

async function addPost(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        const section = await SectionModel.findOne({_id: data.sectionId});
        const post = await Post.findOne({_id: data.postId});
        if (!section) {
            return NextResponse.json(
                JSON.stringify({message: "Không tồn tại danh sách bài viêt"}),
                {status: 404}
            );
        }
        let newIds = [];
        if (section.post_ids.includes(data.postId)) {
            newIds = section.post_ids.map((i: any) => i.toString()).filter((i: any) => i !== data.postId)
            await Post.updateMany(
                {_id: {$in: section.post_ids}, order: {$gt: post.order}},
                {$inc: {order: -1}}
            )
        } else {
            newIds = [...section.post_ids, data.postId];
            await Post.updateMany(
                {_id: {$in: section.post_ids}},
                {$inc: {order: 1}}
            )
        }

        await SectionModel.findByIdAndUpdate(data.sectionId, {$set: {post_ids: newIds}});
        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('SectionModel API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const POST = withAuth(addPost);
