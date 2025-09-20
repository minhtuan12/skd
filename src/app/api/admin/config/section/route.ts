import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import SectionModel from "@/models/section";
import {Types} from "mongoose";

const {ObjectId} = Types;

async function getSections(request: NextRequest) {
    try {
        await connectDb();

        const sections = await SectionModel.find();
        sections.map(async (item) => {
            if (!item.parent_id) {
                const children = await SectionModel.find({parent_id: item._id});
                return {
                    ...item,
                    children
                }
            }
            return {
                ...item,
                children: []
            };
        })
        return NextResponse.json({sections});
    } catch (error) {
        console.error('Get sections API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function addSection(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();
        const section = new SectionModel({...data});
        await section.save();

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

async function updateSection(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        for (let item of data) {
            if (item._id) {
                const {id, ...updated} = item;
                await SectionModel.findOneAndUpdate(
                    {_id: new ObjectId(item._id)},
                    {
                        $set: {...updated}
                    },
                )
            } else {
                await SectionModel.create({
                    ...item
                })
            }
        }

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

export const GET = withAuth(getSections);
export const POST = withAuth(addSection);
export const PATCH = withAuth(updateSection);
