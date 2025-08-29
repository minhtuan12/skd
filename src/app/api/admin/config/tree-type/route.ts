import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import TreeType from "@/models/tree-type";
import {capitalizeFirstWord} from "@/app/api/helpers";
import {withAuth} from "@/app/api/middleware";

async function getTreeTypes(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const q = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1');

        const queryCondition = q ? {name: {$regex: q, $options: 'i'}} : {};
        const result = await TreeType.aggregate([
            {
                $match: {
                    ...queryCondition,
                    is_deleted: false
                }
            },
            {$sort: {createdAt: -1}},
            {
                $facet: {
                    data: [
                        {$skip: 0},
                        {$limit: 10000},
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
                            {$ceil: {$divide: ["$total", 10]}},
                            0
                        ]
                    }
                }
            }
        ]);

        return NextResponse.json({tree_types: result?.[0] || null});
    } catch (error) {
        console.error('Get tree types API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function addTreeType(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data?.name) {
            return NextResponse.json(
                {error: 'Thiếu tên nhóm cây'},
                {status: 400}
            );
        }

        const exist = await TreeType.findOne({
            is_deleted: false,
            name: capitalizeFirstWord(data.name)
        })

        if (exist) {
            return NextResponse.json(
                {error: 'Nhóm cây đã tồn tại', message: 'Nhóm cây đã tồn tại'},
                {status: 400}
            );
        }

        const newTreeType = new TreeType({name: capitalizeFirstWord(data.name)});
        await newTreeType.save();

        return NextResponse.json(
            JSON.stringify({message: "Thêm mới thành công"}),
            {status: 201}
        );
    } catch (error) {
        console.error('Tree type API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getTreeTypes);
export const POST = withAuth(addTreeType);
