import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import {withAuthWithContext} from "@/app/api/middleware";
import KnowledgeCategory from "@/models/knowledge-category";

const {ObjectId} = Types

async function deleteCategory(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;
        const cate = await KnowledgeCategory.findById(id);

        if (!cate) {
            return NextResponse.json(
                {error: 'Không tồn tại', message: 'Không tồn tại'},
                {status: 404}
            );
        }

        if (cate.children && cate.children.length > 0) {
            await KnowledgeCategory.deleteMany({
                _id: {$in: cate.children}
            });
        }
        await KnowledgeCategory.deleteOne({_id: new ObjectId(id)});

        return NextResponse.json(
            JSON.stringify({message: "Xóa thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Delete knowledge category API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const DELETE = withAuthWithContext(deleteCategory);
