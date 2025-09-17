import {model, models, Schema} from "mongoose";

export interface IKnowledgeOrder {
    _id?: string;
    order: number;
    category_id: string;
    knowledge_id: string;
}

const KnowledgeCategorySchema = new Schema({
    order: {
        type: Number,
        default: 0
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'KnowledgeCategories',
    },
    knowledge_id: {
        type: Schema.Types.ObjectId,
        ref: 'Knowledges',
    }
}, {
    timestamps: true
});

const KnowledgeOrder = models?.KnowledgeOrders || model("KnowledgeOrders", KnowledgeCategorySchema);
export default KnowledgeOrder;
