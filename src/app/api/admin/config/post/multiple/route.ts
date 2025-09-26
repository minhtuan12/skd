import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import {Types} from "mongoose";
import Post from "@/models/post";
import SectionModel, {SectionType} from "@/models/section";
import KnowledgeOrder from "@/models/knowledge-order";
import PostOrder from "@/models/post-order";

async function addPost(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();
        const post = new Post({...data});
        await post.save();

        if (data.sectionId && data.addDirectly) {
            const section = await SectionModel.findOne({_id: data.sectionId});
            const newIds = [...section.post_ids, post._id];
            await PostOrder.updateMany(
                {section_id: data.sectionId},
                {$inc: {order: 1}}
            )
            await PostOrder.create({
                section_id: data.sectionId,
                post_id: post._id,
                order: 0
            })
            await SectionModel.findByIdAndUpdate(data.sectionId, {$set: {post_ids: newIds}});
            await section.save();
        }

        return NextResponse.json(
            JSON.stringify({message: "Thêm mới thành công"}),
            {status: 201}
        );
    } catch (error) {
        console.error('SectionModel API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const POST = withAuth(addPost);
