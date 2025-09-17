import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import KnowledgeOrder from "@/models/knowledge-order";
import KnowledgeCategory from "@/models/knowledge-category";

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

        const {knowledgeId, categoryIds, oldOrder, newOrder, categories} = data;
        let bulkOps = [];
        let allCategories = [];
        if (categories?.is_parent && categories?.children?.length > 0) {
            allCategories = categories.children.map((i: any) => i._id);
        } else {
            allCategories = [categories._id];
        }

        if (newOrder < oldOrder) {
            bulkOps.push({
                updateMany: {
                    filter: {order: {$gte: newOrder, $lt: oldOrder}, category_id: {$in: allCategories}},
                    update: {$inc: {order: 1}},
                }
            });
        } else {
            bulkOps.push({
                updateMany: {
                    filter: {order: {$gt: oldOrder, $lte: newOrder}, category_id: {$in: allCategories}},
                    update: {$inc: {order: -1}},
                }
            });
        }
        if (categoryIds.length > 0) {
            categoryIds.forEach((id: string) => {
                bulkOps.push({
                    updateOne: {
                        filter: {knowledge_id: knowledgeId, category_id: id},
                        update: {$set: {order: newOrder}},
                    }
                });
            })
        }
        await KnowledgeOrder.bulkWrite(bulkOps);

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
