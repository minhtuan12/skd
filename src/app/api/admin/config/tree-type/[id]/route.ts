import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import TreeType from "@/models/tree-type";
import {capitalizeFirstWord} from "@/app/api/helpers";

const {ObjectId} = Types

async function updateTreeType(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;

        // Validation
        if (!data?.name) {
            return NextResponse.json(
                {error: 'Thiếu tên nhóm cây'},
                {status: 400}
            );
        }

        const exist = await TreeType.findOne({
            is_deleted: false,
            name: capitalizeFirstWord(data.name),
            _id: {$ne: new ObjectId(id)}
        })

        if (exist) {
            return NextResponse.json(
                {error: 'Nhóm cây đã tồn tại', message: 'Nhóm cây đã tồn tại'},
                {status: 400}
            );
        }

        const result = await TreeType.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: {name: capitalizeFirstWord(data.name)}}
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
        console.error('Update tree type API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function deleteTreeType(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;

        const result = await TreeType.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: {is_deleted: true}}
        )

        if (!result) {
            return NextResponse.json(
                JSON.stringify({message: "Không tồn tại"}),
                {status: 404}
            );
        }
        return NextResponse.json(
            JSON.stringify({message: "Xóa thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Delete tree type API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = (updateTreeType);
export const DELETE = (deleteTreeType);
