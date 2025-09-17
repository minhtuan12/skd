import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Knowledge from "@/models/knowledge";
import KnowledgeCategory from "@/models/knowledge-category";
import {Types} from "mongoose";
import KnowledgeOrder from "@/models/knowledge-order";

const {ObjectId} = Types;

async function getKnowledge(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const q = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const categoryId = searchParams.get('category') || '';

        if (page === 0) {
            const knowledge = await Knowledge.find({is_deleted: false}).sort('-createdAt').populate('category');
            return NextResponse.json({knowledge});
        }

        // const queryCondition = q ? {name: {$regex: q, $options: 'i'}} : {};
        let queryCondition: any = {};
        const category = await KnowledgeCategory.findById(categoryId).populate("children");
        if (category?.children && category.children.length > 0) {
            const childrenIds = category.children.map((c: any) => c._id);
            queryCondition.category_id = {$in: childrenIds};
        } else {
            queryCondition.category_id = new ObjectId(categoryId);
        }
        const [knowledgeOrders, total] = await Promise.all([
            KnowledgeOrder.find({...queryCondition})
                .populate({
                    path: 'category_id',
                    populate: {
                        path: 'children',
                        model: 'KnowledgeCategories',
                    },
                })
                .populate({
                    path: 'knowledge_id',
                    match: {is_deleted: false},
                })
                .sort('order')
                .skip((page - 1) * 9)
                .limit(9),
            KnowledgeOrder.countDocuments({...queryCondition}),
        ]);

        const grouped: any = [];
        const map = new Map();
        knowledgeOrders.forEach(item => {
            const key = `${item.order}_${item.knowledge_id._id.toString()}`;
            if (!map.has(key)) {
                map.set(key, {
                    order: item.order,
                    knowledge: item.knowledge_id,
                    categories: [item.category_id]
                });
            } else {
                map.get(key).categories.push(item.category_id);
            }
        });
        map.forEach(value => grouped.push(value));

        return NextResponse.json({
            knowledge: {
                total,
                totalPages: Math.ceil(total / 9),
                data: grouped?.map((i: any) => ({
                    ...i.knowledge?.toObject(),
                    category_name: category.name
                }))
            }
        });
    } catch (error) {
        console.error('Get knowledge API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getKnowledge;
