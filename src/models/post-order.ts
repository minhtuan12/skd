import {model, models, Schema} from "mongoose";

export interface IPostOrder {
    _id?: string;
    order: number;
    section_id: string;
    post_id: string;
}

const PostOrderSchema = new Schema({
    order: {
        type: Number,
        default: 0
    },
    section_id: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Posts',
    }
}, {
    timestamps: true
});

const PostOrder = models?.PostOrders || model("PostOrders", PostOrderSchema);
export default PostOrder;
