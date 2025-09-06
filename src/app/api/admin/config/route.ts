import Config from "@/models/config";
import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {getConfig} from "@/app/api/helpers";
import {withAuth} from "@/app/api/middleware";

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

export const GET = (getConfig);
export const PATCH = (updateConfig);
