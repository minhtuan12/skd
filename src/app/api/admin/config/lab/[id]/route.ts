import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import {withAuthWithContext} from "@/app/api/middleware";
import Lab from "@/models/lab";

const {ObjectId} = Types

async function updateLab(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;

        // Validation
        if (!data?.name || !data.category ||
            !data.address || !data.location ||
            !data.first_license_date || !data.validity_time || !data.decision
        ) {
            return NextResponse.json(
                {error: 'Thiếu dữ liệu'},
                {status: 400}
            );
        }

        const result = await Lab.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {
                $set: {
                    name: data.name.trim(),
                    category: data.category,
                    address: data.address,
                    location: data.location,
                    first_license_date: data.first_license_date,
                    validity_time: data.validity_time,
                    decision: data.decision,
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
        console.error('Update lab API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = withAuthWithContext(updateLab);
