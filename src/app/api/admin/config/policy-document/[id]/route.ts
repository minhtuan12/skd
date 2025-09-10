import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import {sanitizeHtml} from "@/lib/utils";
import PolicyDocument from "@/models/policy-document";
import {withAuthWithContext} from "@/app/api/middleware";

const {ObjectId} = Types

async function updatePolicyDocument(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Thiếu các trường cần cập nhật'},
                {status: 400}
            );
        }

        const result = await PolicyDocument.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {
                $set: {
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
                    related_posts: data.related_posts
                }
            }
        )

        if (!result) {
            return NextResponse.json(
                JSON.stringify({message: "Không tồn tại"}),
                {status: 404}
            );
        }
        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Policy document API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = withAuthWithContext(updatePolicyDocument);
