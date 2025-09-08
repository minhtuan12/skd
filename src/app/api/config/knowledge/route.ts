import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Knowledge from "@/models/knowledge";
import KnowledgeCategory from "@/models/knowledge-category";
import {Types} from "mongoose";
import PolicyDocument from "@/models/policy-document";

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
            queryCondition.category = {$in: childrenIds};
        } else {
            queryCondition.category = new ObjectId(categoryId);
        }
        const result = await Knowledge.aggregate([
            {
                $match: {
                    is_deleted: false,
                    ...queryCondition
                }
            },
            {$sort: {createdAt: -1}},
            {
                $facet: {
                    data: [
                        {$skip: (page - 1) * 9},
                        {$limit: 9},
                    ],
                    totalCount: [
                        {$count: "count"}
                    ]
                }
            },
            {
                $project: {
                    data: 1,
                    total: {$arrayElemAt: ["$totalCount.count", 0]}
                }
            },
            {
                $addFields: {
                    totalPages: {
                        $cond: [
                            {$gt: ["$total", 0]},
                            {$ceil: {$divide: ["$total", 9]}},
                            0
                        ]
                    }
                }
            }
        ]);

        return NextResponse.json({
            knowledge: {
                ...result?.[0],
                data: result?.[0]?.data?.map((i: any) => ({
                    ...i,
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
