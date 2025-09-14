import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import {changePostOrder} from "@/app/api/helpers";
import Knowledge from "@/models/knowledge";

async function updateKnowledgeOrder(request: NextRequest) {
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

        const {knowledgeId, oldOrder, newOrder} = data;
        await changePostOrder(Knowledge, knowledgeId, newOrder, oldOrder);
        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Knowledge order API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const POST = withAuth(updateKnowledgeOrder);
