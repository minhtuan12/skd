import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import KnowledgeCategory from "@/models/knowledge-category";
import {withAuth} from "@/app/api/middleware";

async function updatePosition(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data.orderIds) {
            return NextResponse.json(
                {error: 'Thiếu mảng thứ tự'},
                {status: 400}
            );
        }

        const bulkOps = data.orderIds.map((id: string, index: number) => ({
            updateOne: {
                filter: {_id: new Object(id)},
                update: {$set: {position: index}}
            }
        }));
        await KnowledgeCategory.bulkWrite(bulkOps);

        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Knowledge category API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const POST = withAuth(updatePosition);
