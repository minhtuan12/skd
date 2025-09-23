import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import PostOrder from "@/models/post-order";

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
        const current = await PostOrder.findOne({section_id: sectionId, post_id: postId});
        if (newOrder < oldOrder) {
            await PostOrder.updateMany(
                {section_id: sectionId, order: {$gte: newOrder, $lt: oldOrder}},
                {$inc: {order: 1}}
            );
        } else {
            await PostOrder.updateMany(
                {section_id: sectionId, order: {$gt: oldOrder, $lte: newOrder}},
                {$inc: {order: -1}}
            );
        }
        current.order = newOrder;
        current.save();

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
