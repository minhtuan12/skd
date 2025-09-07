import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import MapModel from "@/models/map";
import {withAuth} from "@/app/api/middleware";

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

async function addMap(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data?.name || !data.image_url || !data.source) {
            return NextResponse.json(
                {error: 'Thiếu dữ liệu'},
                {status: 400}
            );
        }

        const map = new MapModel({
            name: data.name.trim(),
            image_url: data.image_url,
            data_url: data.data_url ? data.data_url.trim() : null,
            source: data.source.trim()
        });
        await map.save();

        return NextResponse.json(
            JSON.stringify({message: "Thêm mới thành công"}),
            {status: 201}
        );
    } catch (error) {
        console.error('Map API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getMaps);
export const POST = withAuth(addMap);
