import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import MapModel from "@/models/map";

const {ObjectId} = Types

async function updateMap(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;

        // Validation
        if (!data?.name || !data.image_url) {
            return NextResponse.json(
                {error: 'Thiếu dữ liệu'},
                {status: 400}
            );
        }

        const result = await MapModel.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {
                $set: {
                    name: data.name.trim(),
                    image_url: data.image_url,
                    data_url: data.data_url ? data.data_url.trim() : null
                }
            },
        )

        if (!result) {
            return NextResponse.json(
                JSON.stringify({message: "Không tồn tại"}),
                {status: 404}
            );
        }
        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Update map API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = (updateMap);
