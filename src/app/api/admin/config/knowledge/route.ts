import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Knowledge from "@/models/knowledge";
import {sanitizeHtml} from "@/lib/utils";
import {withAuth} from "@/app/api/middleware";

async function getKnowledge(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const q = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const category = searchParams.get('category') || '';

        // const queryCondition = q ? {name: {$regex: q, $options: 'i'}} : {};
        const queryCondition = category ? {category} : {};
        const knowledge = await Knowledge.find({
            is_deleted: false,
            ...queryCondition
        }).populate('tree_type').sort('-createdAt');

        return NextResponse.json({knowledge});
    } catch (error) {
        console.error('Get knowledge API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function addKnowledge(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                {error: 'Không có dữ liệu gửi lên'},
                {status: 400}
            );
        }

        let newKnowledge;
        switch (data.category) {
            case "training":
                break;
            case "renovation":
                newKnowledge = new Knowledge({
                    name: data.name,
                    media: data.media,
                    tree_type: data.tree_type,
                    description: sanitizeHtml(data.description),
                    category: data.category
                });
                break;
            case "farming":
                newKnowledge = new Knowledge({
                    name: data.name,
                    media: data.media,
                    tree_type: data.tree_type,
                    description: sanitizeHtml(data.description),
                    category: data.category
                });
                break;
            case "model":
                newKnowledge = new Knowledge({
                    media: data.media,
                    description: sanitizeHtml(data.description),
                    category: data.category
                })
                break;
        }

        await newKnowledge.save();

        return NextResponse.json(
            JSON.stringify({message: "Thêm mới thành công"}),
            {status: 201}
        );
    } catch (error) {
        console.error('Knowledge API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getKnowledge);
export const POST = withAuth(addKnowledge);
