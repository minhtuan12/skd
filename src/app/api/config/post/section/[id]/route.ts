import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import SectionModel from "@/models/section";
import Post from "@/models/post";
import {Types} from "mongoose";

const {ObjectId} = Types

async function getPostList(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;
        const {searchParams} = new URL(request.url);
        const section = await SectionModel.findOne({_id: id});
        const page = parseInt(searchParams.get('page') || '1');
        const limit = section.header_key === 'knowledge' ? 9 : 15;

        const result = await Post.aggregate([
            {
                $match: {
                    _id: {$in: section.post_ids || []}
                }
            },
            {
                $lookup: {
                    from: 'postorders',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'orders'
                }
            },
            {$unwind: {path: '$orders'}},
            {
                $match: {
                    'orders.section_id': new ObjectId(id),
                }
            },
            {
                $sort: {
                    'orders.section_id': 1,
                    'orders.order': 1
                }
            },
            {
                $facet: {
                    data: [
                        {$skip: (page - 1) * limit},
                        {$limit: limit},
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
                            {$ceil: {$divide: ["$total", limit]}},
                            0
                        ]
                    }
                }
            }
        ]);
        return NextResponse.json({posts: result?.[0] || null});
    } catch (error) {
        console.error('Get post list API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getPostList;
