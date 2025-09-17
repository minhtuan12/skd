import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import {Types} from "mongoose";
import {withAuthWithContext} from "@/app/api/middleware";
import KnowledgeCategory from "@/models/knowledge-category";
import Knowledge from "@/models/knowledge";
import KnowledgeOrder from "@/models/knowledge-order";

const {ObjectId} = Types

async function updateKnowledgeCategory(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const {data} = await request.json();
        const {id} = await params;

        // Validation
        if (!data.name) {
            return NextResponse.json(
                {error: 'Không có dữ liệu gửi lên'},
                {status: 400}
            );
        }

        const exist = await KnowledgeCategory.findOne({
            is_deleted: false,
            name: {$regex: new RegExp(`^${data.name}$`, "i")},
            _id: {$ne: new ObjectId(id)}
        })

        if (exist) {
            return NextResponse.json(
                {error: 'Tên trang đã tồn tại', message: 'Tên trang đã tồn tại'},
                {status: 400}
            );
        }

        const parent = await KnowledgeCategory.findById(id);
        if (!parent) throw new Error("Category not found");

        const childrenIds: any = [];

        for (const child of data.children) {
            if (child._id) {
                childrenIds.push(child._id);
            } else {
                const newChild = new KnowledgeCategory({
                    name: child.name,
                    is_parent: false
                });
                await newChild.save();
                childrenIds.push(newChild._id.toString());
            }
        }

        const oldChildren = parent.children || [];
        const toDelete = oldChildren.filter(
            (oldId: Types.ObjectId) =>
                !childrenIds.some((newId: string) => newId.toString() === oldId.toString())
        );

        if (toDelete.length > 0) {
            await KnowledgeCategory.deleteMany({_id: {$in: toDelete}});
        }

        parent.name = data.name;
        parent.children = childrenIds;
        await parent.save();
        await Promise.all([
            Knowledge.updateMany(
                {category: {$in: toDelete}},
                {$pull: {category: {$in: toDelete}}}
            ),
            KnowledgeOrder.deleteMany({category_id: {$in: toDelete}})
        ]);
        if (oldChildren.length === 0 && data.children.length > 0) {
            await Promise.all([
                Knowledge.updateOne(
                    {category: id},
                    {$set: {category: []}}
                ),
                KnowledgeOrder.deleteMany({category_id: id})
            ]);
        } else if (oldChildren.length > 0 && data.children.length === 0) {
            await Promise.all([
                Knowledge.updateMany(
                    {category: {$in: oldChildren}},
                    {$set: {category: []}}
                ),
                KnowledgeOrder.deleteMany({category_id: {$in: oldChildren}})
            ]);
        }

        return NextResponse.json(
            JSON.stringify({message: "Cập nhật thành công"}),
            {status: 200}
        );
    } catch (error) {
        console.error('Update knowledge category API error:', error);
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
        const cate = await KnowledgeCategory.findById(id);

        if (!cate) {
            return NextResponse.json(
                {error: 'Không tồn tại', message: 'Không tồn tại'},
                {status: 404}
            );
        }

        const isDeleted = cate.is_deleted;
        await KnowledgeCategory.findOneAndUpdate({
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
        console.error('Update knowledge category API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export const PATCH = withAuthWithContext(updateKnowledgeCategory);
export const DELETE = withAuthWithContext(changeVisibility);
