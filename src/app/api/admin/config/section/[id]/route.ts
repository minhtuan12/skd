import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import {withAuthWithContext} from "@/app/api/middleware";
import SectionModel, {SectionType} from "@/models/section";
import Post from "@/models/post";

const {ObjectId} = Types

async function updateOneSection(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id: sectionId} = await params;

        let section = await SectionModel.findById(sectionId);
        if (data?.children?.length > 0) {
            for (let item of data.children) {
                const {id, children, ...updated} = item;
                if (item._id) {
                    await SectionModel.findOneAndUpdate(
                        {_id: new ObjectId(item._id)},
                        {
                            $set: {...updated}
                        },
                    )
                } else {
                    await SectionModel.create({
                        ...item,
                        parent_id: sectionId
                    })
                }
            }
        }
        section.image_url = data.image_url;
        section.parent_id = data.parent_id;
        section.header_key = data.header_key;
        section.post_id = data.post_id;
        section.type = data.type;
        section.name = data.name;
        section.is_deleted = data.is_deleted;
        section.save();

        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Update section API error:', error);
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
        const section = await SectionModel.findById(id);

        if (!section) {
            return NextResponse.json(
                {error: 'Không tồn tại', message: 'Không tồn tại'},
                {status: 404}
            );
        }

        const isDeleted = section.is_deleted;
        await SectionModel.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            $set: {
                is_deleted: !isDeleted
            }
        })
        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Update section API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function getSectionById(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;
        let section: any = await SectionModel.findOne({_id: id}).populate('post_id').lean();
        if (section?.type === SectionType.list) {
            const posts = await Post.find({parent_id: id});
            section = {...section, posts};
        }

        return NextResponse.json({section});
    } catch (error) {
        console.error('Get detail section API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuthWithContext(getSectionById);
export const PATCH = withAuthWithContext(updateOneSection);
export const DELETE = withAuthWithContext(changeVisibility);
