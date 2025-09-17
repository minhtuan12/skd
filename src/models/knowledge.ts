import {model, models, Schema} from "mongoose";
import {IKnowledgeCategory} from "@/models/knowledge-category";

export interface IKnowledge {
    _id?: string;
    media?: {
        url: string | File,
        media_type: 'video' | 'image'
    },
    category: string[] | IKnowledgeCategory[],
    name: string,
    text: string,
    slide: {
        url: string | null,
        downloadable: boolean,
    },
    pdf: {
        url: string | null,
        downloadable: boolean,
    },
    link: string | null,
    video_url: string | null;
    related_posts: string[] | IKnowledge[],
    is_deleted?: boolean,
    createdAt?: string,
    category_id?: string | IKnowledgeCategory,
    knowledge_id?: string | IKnowledge,
    categories?: IKnowledgeCategory[],
    knowledge?: IKnowledge,
    order?: number;
}

const KnowledgeSchema = new Schema({
    media: {
        url: {
            type: String,
            required: true,
        },
        media_type: {
            type: String,
            required: true,
            enum: ['video', 'image']
        }
    },
    category: {
        type: [Schema.Types.ObjectId],
        ref: 'KnowledgeCategories'
    },
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        default: ''
    },
    slide: {
        url: {
            type: String,
            default: null
        },
        downloadable: {
            type: Boolean,
            default: false
        }
    },
    pdf: {
        url: {
            type: String,
            default: null
        },
        downloadable: {
            type: Boolean,
            default: false
        }
    },
    link: {
        type: String,
        default: null
    },
    video_url: {
        type: String,
        default: null
    },
    related_posts: {
        type: [Schema.Types.ObjectId],
        ref: "Knowledges"
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Knowledge = models?.Knowledges || model("Knowledges", KnowledgeSchema);
export default Knowledge;
