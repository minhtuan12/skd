import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Knowledge from "@/models/knowledge";
import {withAuth} from "@/app/api/middleware";
import {Types} from "mongoose";
import KnowledgeOrder from "@/models/knowledge-order";
import KnowledgeCategory from "@/models/knowledge-category";

const {ObjectId} = Types;

async function addCategoryToKnowledge(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Không có dữ liệu gửi lên'},
                {status: 400}
            );
        }

        ////
        const oldRecords = await KnowledgeOrder.find({knowledge_id: data.knowledgeId});
        const oldCategories = oldRecords.map(r => r.category_id.toString());

        const oldCategoriesSet = new Set(oldCategories);
        const categoriesSet = new Set(data.categories);
        const toAdd = data.categories.filter((c: any) => !oldCategoriesSet.has(c));
        const toRemove = oldCategories.filter((c: any) => !categoriesSet.has(c));

        // ===== ADD =====
        if (toAdd.length > 0) {
            const category = await KnowledgeCategory.findById(toAdd[0]);
            if (category) {
                if (category.is_parent) {
                    await KnowledgeOrder.updateMany(
                        {category_id: category._id},
                        {$inc: {order: 1}}
                    );
                    await KnowledgeOrder.create({
                        knowledge_id: data.knowledgeId,
                        category_id: category._id,
                        order: 0
                    });
                } else {
                    const parent = (await KnowledgeCategory.findOne({children: category._id}));
                    if (parent) {
                        const childIds = parent.children;
                        await KnowledgeOrder.updateMany(
                            {category_id: {$in: childIds}},
                            {$inc: {order: 1}}
                        );
                        const bulk = toAdd.map((cId: any) => {
                            KnowledgeOrder.create({
                                knowledge_id: data.knowledgeId,
                                category_id: cId,
                                order: 0
                            });
                        })
                        await Promise.all(bulk);
                    }
                }
            }
        }

        // ===== REMOVE =====
        if (toRemove.length > 0) {
            for (const catId of toRemove) {
                const record = await KnowledgeOrder.findOne({knowledge_id: data.knowledgeId, category_id: catId});
                if (!record) continue;

                const category = await KnowledgeCategory.findById(catId);
                if (!category) continue;

                if (category.is_parent) {
                    await KnowledgeOrder.updateMany(
                        {category_id: category._id, order: {$gt: record.order}},
                        {$inc: {order: -1}}
                    );
                } else {
                    const parent = await KnowledgeCategory.findOne({children: category._id});
                    if (parent) {
                        const childIds = parent.children;
                        await KnowledgeOrder.updateMany(
                            {category_id: {$in: childIds}, order: {$gt: record.order}},
                            {$inc: {order: -1}}
                        );
                    }
                }

                await record.deleteOne();
            }
        }
        ////

        const result = await Knowledge.findOneAndUpdate(
            {_id: new ObjectId(data.knowledgeId as string)},
            {$set: {category: data.categories}}
        )

        if (!result) {
            return NextResponse.json(
                JSON.stringify({message: "Không tìm thấy bài đăng"}),
                {status: 404}
            );
        }

        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch
        (error) {
        console.error('Add category to knowledge API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const POST = withAuth(addCategoryToKnowledge);
