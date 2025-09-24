import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {withAuth} from "@/app/api/middleware";
import Post from "@/models/post";
import SectionModel, {SectionType} from "@/models/section";

async function getPosts(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const key = searchParams.get('key');
        const sectionId = searchParams.get('sectionId');
        if (!sectionId) {
            const posts = await Post.aggregate([
                {$match: {header_key: key, title: {$ne: ''}}},
                {
                    $lookup: {
                        from: 'postorders',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'orders'
                    }
                },
                {$unwind: {path: '$orders', preserveNullAndEmptyArrays: true}},
                {
                    $sort: {
                        'orders.section_id': 1,
                        'orders.order': 1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        image_url: 1,
                        text: 1,
                        slide: 1,
                        pdf: 1,
                        downloads: 1,
                        link: 1,
                        video_url: 1,
                        related_posts: 1,
                        header_key: 1,
                        is_deleted: 1,
                        createdAt: 1,
                        order: '$orders.order',
                        section_id: '$orders.section_id',
                    }
                }
            ])
            return NextResponse.json({posts});
        }

        let result: any = [];
        const posts = await Post.aggregate([
            {$match: {header_key: key, title: {$ne: ''}}},
            {
                $lookup: {
                    from: 'postorders',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'orders'
                }
            },
            {$unwind: {path: '$orders', preserveNullAndEmptyArrays: true}},
            {
                $sort: {
                    'orders.section_id': 1,
                    'orders.order': 1
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    image_url: 1,
                    text: 1,
                    slide: 1,
                    pdf: 1,
                    downloads: 1,
                    link: 1,
                    video_url: 1,
                    related_posts: 1,
                    header_key: 1,
                    is_deleted: 1,
                    createdAt: 1,
                    order: '$orders.order',
                    section_id: '$orders.section_id',
                }
            }
        ])

        const listSections = await SectionModel.find({
            header_key: key,
            type: SectionType.post,
            is_deleted: false
        }).populate('post_id').lean();

        result = [
            ...posts,
            ...listSections.filter((item: any) => item.post_id).map((item: any) => ({
                ...item.post_id,
                title: item.name,
                section_id: item._id
            }))
        ]
        return NextResponse.json({posts: result});
    } catch (error) {
        console.error('Get posts API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getPosts);
