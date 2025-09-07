import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import PolicyDocument from "@/models/policy-document";

async function getPolicyDocument(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const q = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1');

        // const queryCondition = q ? {name: {$regex: q, $options: 'i'}} : {};
        if (page === 0) {
            const documents = await PolicyDocument.find({is_deleted: false}).sort('-createdAt');
            return NextResponse.json({documents});
        }

        const result = await PolicyDocument.aggregate([
            {
                $match: {
                    is_deleted: false,
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
        return NextResponse.json({documents: result?.[0] || null});
    } catch (error) {
        console.error('Get policy document API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getPolicyDocument;
