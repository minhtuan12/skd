import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import {sanitizeHtml} from "@/lib/utils";
import PolicyDocument from "@/models/policy-document";

async function getPolicyDocuments(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const skip = (page - 1) * 15;

        const [documents, total] = await Promise.all([
            PolicyDocument.find({})
                .sort('order')
                .skip(skip)
                .limit(15),
            PolicyDocument.countDocuments({})
        ]);

        return NextResponse.json({
            documents,
            total,
            page,
            totalPages: Math.ceil(total / 15),
        });
    } catch (error) {
        console.error('Policy document API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function addDocument(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Thiếu các trường cần cập nhật'},
                {status: 400}
            );
        }

        const newDocument = new PolicyDocument({
            title: data.title,
            text: data.text ? sanitizeHtml(data.text) : '',
            slide: {
                url: data.slide.url || null,
                downloadable: data.slide.downloadable
            },
            pdf: {
                url: data.pdf.url || null,
                downloadable: data.pdf.downloadable
            },
            link: data.link || '',
            image_url: data.image_url,
            order: 0
        });

        await PolicyDocument.updateMany({}, {$inc: {order: 1}});
        await newDocument.save();

        return NextResponse.json(
            JSON.stringify({message: "Thêm mới thành công"}),
            {status: 201}
        );
    } catch (error) {
        console.error('Policy document API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getPolicyDocuments);
export const POST = withAuth(addDocument);
