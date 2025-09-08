import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import KnowledgeCategory from "@/models/knowledge-category";
import {Types} from "mongoose";

const {ObjectId} = Types;

async function getSubCategory(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;
        const pages = await KnowledgeCategory.findOne({
            is_deleted: false,
            _id: new ObjectId(id),
            is_parent: true
        }).populate('children');
        return NextResponse.json({pages});
    } catch (error) {
        console.error('Get knowledge API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getSubCategory;
