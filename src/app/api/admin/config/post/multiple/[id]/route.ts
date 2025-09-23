import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuthWithContext} from "@/app/api/middleware";
import Post from "@/models/post";
import SectionModel from "@/models/section";
import PostOrder from "@/models/post-order";

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
            SectionModel.updateMany({post_ids: id}, {$pull: {post_ids: id}}),
        ]);

        const records = await PostOrder.find({
            post_id: id
        });

        const grouped = records.reduce((acc: any, cur: any) => {
            const sid = cur.section_id.toString();
            if (!acc[sid]) acc[sid] = [];
            acc[sid].push(cur);
            return acc;
        }, {} as Record<string, typeof records>);

        for (const [sectionId, items] of Object.entries(grouped) as [string, any]) {
            for (const item of items) {
                await PostOrder.deleteOne({section_id: item.section_id, post_id: id});
                await PostOrder.updateMany(
                    {
                        section_id: item.section_id,
                        order: {$gt: item.order}
                    },
                    {$inc: {order: -1}}
                );
            }
        }
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
