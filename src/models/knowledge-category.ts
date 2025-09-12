import {model, models, Schema} from "mongoose";

export interface IKnowledgeCategory {
    _id?: string;
    position?: number;
    name: string;
    children?: string[] | IKnowledgeCategory[];
    is_parent?: boolean;
    is_deleted?: boolean,
    createdAt?: string;
}

const KnowledgeCategorySchema = new Schema({
    position: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        default: null
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: "KnowledgeCategories",
        },
    ],
    is_parent: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const KnowledgeCategory = models?.KnowledgeCategories || model("KnowledgeCategories", KnowledgeCategorySchema);
export default KnowledgeCategory;
