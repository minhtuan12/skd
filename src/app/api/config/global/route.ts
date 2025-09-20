import Config from "@/models/config";
import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import SectionModel from "@/models/section";

export async function GET(request: NextRequest) {
    try {
        await connectDb();
        await Config.updateOne({}, {$inc: {traffic: 1}});
        const globalConfig: any = await Config.findOne().select('home traffic').lean();
        const menu = await SectionModel.find({is_deleted: false});
        if (!globalConfig) {
            return NextResponse.json(
                {error: 'Không tồn tại thông tin cấu hình'},
                {status: 404}
            );
        }

        return NextResponse.json({config: {...globalConfig.home.banner}, traffic: globalConfig.traffic, menu});
    } catch (error) {
        console.error('Global config API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}
