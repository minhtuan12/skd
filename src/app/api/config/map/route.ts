import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import MapModel from "@/models/map";

async function getMaps(request: NextRequest) {
    try {
        await connectDb();

        const maps = await MapModel.find({is_deleted: false}).sort('-createdAt');
        return NextResponse.json({maps});
    } catch (error) {
        console.error('Get maps API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getMaps;
