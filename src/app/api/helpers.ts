import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Config from "@/models/config";

export async function getConfig(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const page = searchParams.get('page');
        let config;
        if (page) {
            config = await Config.findOne().select(page).lean();
        } else {
            config = await Config.findOne().lean();
        }

        if (!config) {
            return NextResponse.json(
                {error: 'Không tồn tại thông tin cấu hình'},
                {status: 404}
            );
        }

        return NextResponse.json({config});
    } catch (error) {
        console.error('Config API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}
