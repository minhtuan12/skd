import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import {sanitizeHtml} from "@/lib/utils";
import PolicyDocument from "@/models/policy-document";

async function getPolicyDocuments(request: NextRequest) {
    try {
        await connectDb();

        const documents = await PolicyDocument.find({}).sort('-createdAt');
        return NextResponse.json({documents});
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

        const isDescriptionText = data.description.type === 'text';
        const newDocument = new PolicyDocument({
            title: data.title,
            description: {
                description_type: isDescriptionText ? 'text' : 'link',
                content: isDescriptionText ? sanitizeHtml(data.description.content) : data.description.content,
            },
            image_url: data.image_url,
        });
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
