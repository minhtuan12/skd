import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import TreeType from "@/models/tree-type";

async function getTreeTypes(request: NextRequest) {
    try {
        await connectDb();

        const treeTypes = await TreeType.find({is_deleted: false}).sort('-createdAt');
        return NextResponse.json({tree_types: treeTypes});
    } catch (error) {
        console.error('Get tree types API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getTreeTypes;
