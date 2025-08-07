import Config from "@/models/config";
import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";

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

async function updateConfig(request: NextRequest) {
    try {
        await connectDb();

        const {page, data} = await request.json();

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Thiếu các trường cần cập nhật'},
                {status: 400}
            );
        }

        await Config.findOneAndUpdate({}, {$set: {[page]: data}})

        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Config API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getConfig);
export const PATCH = withAuth(updateConfig);
