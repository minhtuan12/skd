import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import {sanitizeHtml} from "@/lib/utils";
import Knowledge from "@/models/knowledge";
import {withAuthWithContext} from "@/app/api/middleware";

const {ObjectId} = Types

async function updateKnowledge(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Không có dữ liệu gửi lên'},
                {status: 400}
            );
        }

        let newKnowledge;
        switch (data.category) {
            case "training":
                break;
            case "renovation":
                newKnowledge = {
                    name: data.name,
                    media: data.media,
                    tree_type: data.tree_type,
                    description: sanitizeHtml(data.description),
                    category: data.category
                };
                break;
            case "farming":
                newKnowledge = {
                    name: data.name,
                    media: data.media,
                    tree_type: data.tree_type,
                    description: sanitizeHtml(data.description),
                    category: data.category
                };
                break;
            case "model":
                newKnowledge = {
                    name: data.name,
                    media: data.media,
                    description: sanitizeHtml(data.description),
                    category: data.category
                }
        }

        const result = await Knowledge.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: {...newKnowledge}}
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
        console.error('Update tree type API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = withAuthWithContext(updateKnowledge);
