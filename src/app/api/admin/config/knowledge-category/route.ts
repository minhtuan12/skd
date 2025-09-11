import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import KnowledgeCategory from "@/models/knowledge-category";

async function getKnowledgeCategories(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);

        // const q = searchParams.get('q') || '';
        // const queryCondition = q ? {name: {$regex: q, $options: 'i'}} : {};

        const knowledgeCategories = await KnowledgeCategory.find({
            is_parent: true
        }).sort('-createdAt').populate('children');

        return NextResponse.json({knowledge_categories: knowledgeCategories});
    } catch (error) {
        console.error('Get knowledge categories API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

async function addKnowledgeCategory(request: NextRequest) {
    try {
        await connectDb();

        const {data} = await request.json();

        // Validation
        if (!data.name) {
            return NextResponse.json(
                {error: 'Thiếu tên trang'},
                {status: 400}
            );
        }

        const exist = await KnowledgeCategory.findOne({
            is_deleted: false,
            name: {$regex: new RegExp(`^${data.name}$`, "i")},
        })

        if (exist) {
            return NextResponse.json(
                {error: 'Tên trang đã tồn tại', message: 'Tên trang đã tồn tại'},
                {status: 400}
            );
        }

        let childrenIds: string[] = [];
        if (data.children && data.children.length > 0) {
            const childrenDocs = await KnowledgeCategory.insertMany(
                data.children.map((childName: string) => ({
                    name: childName,
                    is_parent: false
                }))
            );
            childrenIds = childrenDocs.map((doc) => doc._id.toString());
        }

        const newKnowledgeCategory = new KnowledgeCategory({
            name: data.name,
            children: childrenIds
        })

        await newKnowledgeCategory.save();

        return NextResponse.json(
            JSON.stringify({message: "Thêm mới thành công"}),
            {status: 201}
        );
    } catch (error) {
        console.error('Knowledge category API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getKnowledgeCategories);
export const POST = withAuth(addKnowledgeCategory);
