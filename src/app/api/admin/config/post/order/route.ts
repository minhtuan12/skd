import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import Post from "@/models/post";
import SectionModel from "@/models/section";

async function updatePostOrderBySectionId(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Thiếu các trường cần cập nhật'},
                {status: 400}
            );
        }

        const {sectionId, postId, oldOrder, newOrder} = data;
        let bulkOps = [];
        const section = await SectionModel.findOne({_id: sectionId});
        const postIds = section.post_ids.filter((i: string) => i !== postId);
        if (newOrder < oldOrder) {
            bulkOps.push({
                updateMany: {
                    filter: {order: {$gte: newOrder, $lt: oldOrder}, _id: {$in: postIds}},
                    update: {$inc: {order: 1}},
                }
            });
        } else {
            bulkOps.push({
                updateMany: {
                    filter: {order: {$gt: oldOrder, $lte: newOrder}, _id: {$in: postIds}},
                    update: {$inc: {order: -1}},
                }
            });
        }
        bulkOps.push({
            updateOne: {
                filter: {_id: postId},
                update: {$set: {order: newOrder}},
            }
        });
        await Post.bulkWrite(bulkOps);

        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('post order API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const POST = withAuth(updatePostOrderBySectionId);
