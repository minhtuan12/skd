import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import PolicyDocument from "@/models/policy-document";
import {withAuth} from "@/app/api/middleware";
import {changePostOrder} from "@/app/api/helpers";

async function updatePolicyDocumentOrder(request: NextRequest) {
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

        const {docId, oldOrder, newOrder} = data;
        await changePostOrder(PolicyDocument, docId, newOrder, oldOrder);
        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Policy document order API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const POST = withAuth(updatePolicyDocumentOrder);
