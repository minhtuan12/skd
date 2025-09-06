import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import PolicyDocument from "@/models/policy-document";

const {ObjectId} = Types

async function getDetailDocument(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {id} = await params;

        const doc = await PolicyDocument.findOne({
            is_deleted: false,
            _id: new ObjectId(id)
        })
        return NextResponse.json({document: doc || null});
    } catch (error) {
        console.error('Get detail document API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = getDetailDocument;
