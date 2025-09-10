import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import IntroductionModel from "@/models/introduction";
import {sanitizeHtml} from "@/lib/utils";

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

async function updateIntroduction(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data?.page || !data?.content) {
            return NextResponse.json(
                {error: 'Thiếu dữ liệu'},
                {status: 400}
            );
        }

        let introduction = await IntroductionModel.findOne({});
        if (!introduction) {
            const newIntroduction = new IntroductionModel({
                [data.page]: sanitizeHtml(data.content)
            })
            await newIntroduction.save();
        } else {
            await IntroductionModel.findOneAndUpdate({}, {$set: {[data.page]: sanitizeHtml(data.content)}})
        }

        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 201}
        );
    } catch (error) {
        console.error('Introduction API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getIntroduction);
export const POST = withAuth(updateIntroduction);
