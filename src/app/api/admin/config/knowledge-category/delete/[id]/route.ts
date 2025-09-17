import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import {withAuthWithContext} from "@/app/api/middleware";
import KnowledgeCategory from "@/models/knowledge-category";
import Knowledge from "@/models/knowledge";
import KnowledgeOrder from "@/models/knowledge-order";

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
            const idsToRemove = cate.children;
            await Promise.all([
                KnowledgeCategory.deleteMany({
                    _id: {$in: idsToRemove}
                }),
                Knowledge.updateMany(
                    {category: {$in: idsToRemove}},
                    {$pull: {category: {$in: idsToRemove}}}
                ),
                KnowledgeOrder.deleteMany({category_id: {$in: idsToRemove}})
            ]);
        } else {
            await Promise.all([
                // remove categories from knowledge
                await Knowledge.updateMany(
                    {category: new ObjectId(id)},
                    {$pull: {category: id}}
                ),
                await KnowledgeOrder.deleteMany({category_id: id})
            ]);
        }
        await KnowledgeCategory.deleteOne({_id: new ObjectId(id)})

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
