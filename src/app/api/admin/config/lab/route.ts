import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import Lab from "@/models/lab";

async function getLabs(request: NextRequest) {
    try {
        await connectDb();

        const labs = await Lab.find({is_deleted: false}).sort('-createdAt');
        return NextResponse.json({labs});
    } catch (error) {
        console.error('Get labs API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function addLab(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

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

        const lab = new Lab({
            name: data.name,
            category: data.category,
            address: data.address,
            location: data.location,
            first_license_date: data.first_license_date,
            validity_time: data.validity_time,
            decision: data.decision,
        });
        await lab.save();

        return NextResponse.json(
            JSON.stringify({message: "Thêm mới thành công"}),
            {status: 201}
        );
    } catch (error) {
        console.error('Lab API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getLabs);
export const POST = withAuth(addLab);
