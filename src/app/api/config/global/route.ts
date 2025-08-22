import Config from "@/models/config";
import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        await connectDb();
        const globalConfig: any = await Config.findOne().select('home').lean();
        if (!globalConfig) {
            return NextResponse.json(
                {error: 'Không tồn tại thông tin cấu hình'},
                {status: 404}
            );
        }

        return NextResponse.json({config: {...globalConfig.home.banner}});
    } catch (error) {
        console.error('Global config API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}
