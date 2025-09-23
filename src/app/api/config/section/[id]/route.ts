import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import SectionModel from "@/models/section";

async function getSectionById(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;
        let section: any = await SectionModel.findOne({_id: id}).lean();
        return NextResponse.json({section});
    } catch (error) {
        console.error('Get detail section API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getSectionById;
