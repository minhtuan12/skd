import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Knowledge from "@/models/knowledge";
import {sanitizeHtml} from "@/lib/utils";
import {withAuth} from "@/app/api/middleware";
import {Types} from "mongoose";
import KnowledgeCategory from "@/models/knowledge-category";
import KnowledgeOrder from "@/models/knowledge-order";

const {ObjectId} = Types

async function getKnowledge(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const q = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const categoryId = searchParams.get('category') || '';

        // const queryCondition = q ? {name: {$regex: q, $options: 'i'}} : {};
        let queryCondition: any = {};

        if (!categoryId) {
            const knowledge = await Knowledge.find().sort('-createdAt');
            return NextResponse.json({knowledge});
        }

        const category = await KnowledgeCategory.findById(categoryId).populate("children");
        if (category?.children && category.children.length > 0) {
            const childrenIds = category.children.map((c: any) => c._id);
            queryCondition.category_id = {$in: childrenIds};
        } else {
            queryCondition.category_id = new ObjectId(categoryId);
        }

        const knowledgeOrders = await KnowledgeOrder
            .find({...queryCondition})
            .populate({
                path: 'category_id',
                populate: {
                    path: 'children',
                    model: 'KnowledgeCategories'
                }
            })
            .populate('knowledge_id')
            .sort('order');

        const grouped: any = [];
        const map = new Map();
        knowledgeOrders.forEach(item => {
            const key = `${item.order}_${item.knowledge_id._id.toString()}`;
            if (!map.has(key)) {
                map.set(key, {
                    order: item.order,
                    knowledge: item.knowledge_id,
                    categories: [item.category_id]
                });
            } else {
                map.get(key).categories.push(item.category_id);
            }
        });
        map.forEach(value => grouped.push(value));

        return NextResponse.json({knowledge: grouped});
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

        const newKnowledge = new Knowledge({
            name: data.name,
            media: data.media,
            category: data.category,
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
            related_posts: data.related_posts,
        });

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
