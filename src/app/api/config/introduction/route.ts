import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import IntroductionModel from "@/models/introduction";

async function getIntroduction(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const page = searchParams.get('page') || 'land';
        const introduction = await IntroductionModel.findOne({}).select(page);
        return NextResponse.json({introduction});
    } catch (error) {
        console.error('Get introduction API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getIntroduction;
