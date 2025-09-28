import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import PostOrder from "@/models/post-order";
import NewsEvents from "@/models/news-events";

async function updateOrder(request: NextRequest) {
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

        const {eventId, oldOrder, newOrder} = data;
        const current = await NewsEvents.findOne({_id: eventId, type: 'event'});
        if (newOrder < oldOrder) {
            await NewsEvents.updateMany(
                {order: {$gte: newOrder, $lt: oldOrder}},
                {$inc: {order: 1}}
            );
        } else {
            await NewsEvents.updateMany(
                {order: {$gt: oldOrder, $lte: newOrder}},
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
        console.error('event order API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const POST = withAuth(updateOrder);
