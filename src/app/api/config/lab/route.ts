import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
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

export const GET = getLabs;
