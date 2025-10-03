import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Lab from "@/models/lab";
import SectionModel from "@/models/section";

async function getLabs(request: NextRequest) {
    try {
        await connectDb();

        const labs = await Lab.find({is_deleted: false}).sort('-createdAt');
        const pageTitle = await SectionModel.findOne({header_key: 'map', order: 1});
        return NextResponse.json({labs, title: pageTitle.name});
    } catch (error) {
        console.error('Get labs API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getLabs;
