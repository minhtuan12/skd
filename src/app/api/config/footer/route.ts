import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import FooterModel from "@/models/footer";

async function getFooter(request: NextRequest) {
    try {
        await connectDb();

        const footer = await FooterModel.findOne({});
        return NextResponse.json({footer});
    } catch (error) {
        console.error('Get footer API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getFooter;
