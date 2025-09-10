import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import Knowledge from "@/models/knowledge";
import KnowledgeCategory from "@/models/knowledge-category";

const {ObjectId} = Types

async function getDetailKnowledge(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;

        let doc = await Knowledge.findOne({
            is_deleted: false,
            _id: new ObjectId(id)
        }).populate('related_posts').populate('category')
        return NextResponse.json({knowledge: doc || null});
    } catch (error) {
        console.error('Get detail knowledge API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getDetailKnowledge;
