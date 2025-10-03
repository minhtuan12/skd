import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import MapModel from "@/models/map";
import SectionModel from "@/models/section";

async function getMaps(request: NextRequest) {
    try {
        await connectDb();

        const maps = await MapModel.find({is_deleted: false}).sort('-createdAt');
        const pageTitle = await SectionModel.findOne({header_key: 'map', order: 0});

        return NextResponse.json({maps, title: pageTitle.name});
    } catch (error) {
        console.error('Get maps API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getMaps;
