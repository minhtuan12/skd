import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import {Types} from "mongoose";
import Post from "@/models/post";
import SectionModel, {SectionType} from "@/models/section";

const {ObjectId} = Types;

async function getPosts(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const key = searchParams.get('key');
        const posts = await SectionModel.find({header_key: key, type: SectionType.post}).populate('post_id');
        return NextResponse.json({posts});
    } catch (error) {
        console.error('Get posts API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function addPost(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();
        const section = new Post({...data});
        await section.save();

        await SectionModel.findOneAndUpdate(
            {_id: data.sectionId},
            {$set: {post_id: section._id}}
        )

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

export const GET = withAuth(getPosts);
export const POST = withAuth(addPost);
