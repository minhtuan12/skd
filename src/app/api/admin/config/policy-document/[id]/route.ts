import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import {sanitizeHtml} from "@/lib/utils";
import PolicyDocument from "@/models/policy-document";

const {ObjectId} = Types

async function updatePolicyDocument(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Thiếu các trường cần cập nhật'},
                {status: 400}
            );
        }

        const isDescriptionText = data.description.description_type === 'text';
        const result = await PolicyDocument.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {
                $set: {
                    title: data.title,
                    description: {
                        description_type: isDescriptionText ? 'text' : 'link',
                        content: isDescriptionText ? sanitizeHtml(data.description.content) : data.description.content,
                    },
                    image_url: data.image_url,
                }
            }
        )

        if (!result) {
            return NextResponse.json(
                JSON.stringify({message: "Không tồn tại"}),
                {status: 404}
            );
        }
        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Policy document API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = (updatePolicyDocument);
