import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import KnowledgeCategory from "@/models/knowledge-category";

async function getKnowledgeCategory(request: NextRequest) {
    try {
        await connectDb();

        const pages = await KnowledgeCategory.find({
            is_deleted: false,
            is_parent: true
        }).sort('-createdAt').populate('children');
        return NextResponse.json({pages});
    } catch (error) {
        console.error('Get knowledge API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getKnowledgeCategory;
