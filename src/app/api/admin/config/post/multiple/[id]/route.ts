import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuthWithContext} from "@/app/api/middleware";
import Post from "@/models/post";
import SectionModel from "@/models/section";

async function updatePost(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;
        const result = await Post.findOneAndUpdate(
            {_id: id},
            {$set: {...data}}
        );

        if (!result) {
            return NextResponse.json(
                JSON.stringify({message: "Không tồn tại bài viết"}),
                {status: 404}
            );
        }

        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Update post API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function deletePost(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;
        await Promise.all([
            Post.findByIdAndDelete(id),
            SectionModel.updateMany({post_ids: id}, {$pull: {post_ids: id}})
        ]);

        return NextResponse.json(
            JSON.stringify({message: "Xóa thành công"}),
            {status: 200}
        );
    } catch
        (error) {
        console.error('Delete post API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = withAuthWithContext(updatePost);
export const DELETE = withAuthWithContext(deletePost);
