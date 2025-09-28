import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import FooterModel from "@/models/footer";

async function getFooter(request: NextRequest) {
    try {
        await connectDb();

        const footer = await FooterModel.findOne({});
        return NextResponse.json({footer});
    } catch (error) {
        console.error('Get footer API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function updateFooter(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();
        await FooterModel.findOneAndUpdate({}, {
            $set: {...data}
        })

        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('footer API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getFooter);
export const POST = withAuth(updateFooter);
