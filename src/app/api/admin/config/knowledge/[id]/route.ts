import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import {sanitizeHtml} from "@/lib/utils";
import Knowledge from "@/models/knowledge";
import {withAuthWithContext} from "@/app/api/middleware";
import KnowledgeCategory from "@/models/knowledge-category";

const {ObjectId} = Types

async function updateKnowledge(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Không có dữ liệu gửi lên'},
                {status: 400}
            );
        }

        const newKnowledge = {
            name: data.name,
            media: data.media,
            // category: data.category,
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
            video_url: data.video_url || null,
            related_posts: data.related_posts
        };

        const result = await Knowledge.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: {...newKnowledge}}
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
        console.error('Update knowledge API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function changeVisibility(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;
        // const cate = await KnowledgeCategory.findById(id);
        //
        // if (!cate) {
        //     return NextResponse.json(
        //         {error: 'Không tồn tại', message: 'Không tồn tại'},
        //         {status: 404}
        //     );
        // }
        //
        // const isDeleted = cate.is_deleted;
        // // TODO: khi lấy các bài ra thì check để bỏ những bài thuộc trang bị ẩn
        // await KnowledgeCategory.findOneAndUpdate({
        //     _id: new ObjectId(id)
        // }, {
        //     $set: {
        //         is_deleted: !isDeleted
        //     }
        // })
        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Update knowledge category API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = withAuthWithContext(updateKnowledge);
